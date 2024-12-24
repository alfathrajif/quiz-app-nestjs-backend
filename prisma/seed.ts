import { PrismaClient } from '@prisma/client';
import slugify from 'slugify';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function generateRole() {
  const adminRole = await prisma.role.create({
    data: {
      name: 'admin',
    },
  });

  const userRole = await prisma.role.create({
    data: {
      name: 'user',
    },
  });

  return {
    adminRole,
    userRole,
  };
}

async function generateUser(role: { uuid: string; name: string }) {
  const passwordHash = await bcrypt.hash('Password123', 10);

  if (role.name === 'admin') {
    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@example.com',
        password: passwordHash,
        role_uuid: role.uuid,
        phone: '123456789',
      },
    });
    return adminUser;
  } else {
    const customerUser = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: passwordHash,
        role_uuid: role.uuid,
        phone: '987654321',
      },
    });
    return customerUser;
  }
}

async function generateSubscriptionPlans() {
  await prisma.subscriptionPlan.create({
    data: {
      name: 'premium',
      description: 'Premium subscription plan',
      price: 100_000,
      duration: 'weekly',
      is_active: true,
    },
  });

  await prisma.subscriptionPlan.create({
    data: {
      name: 'basic',
      description: 'Basic subscription plan',
      price: 0,
      duration: 'infinity',
      is_active: true,
    },
  });
}

async function generateTryout(user_uuid: string) {
  await prisma.tryout.create({
    data: {
      title: 'Sample Tryout',
      slug: slugify('Sample Tryout', { lower: true }),
      description: 'A sample tryout for testing purposes.',
      user_uuid: user_uuid,
      sections: {
        create: [
          {
            name: 'General Knowledge Section',
            slug: slugify('General Knowledge Section', { lower: true }),
            description: 'Section of general knowledge questions',
            user_uuid: user_uuid,
            quizzes: {
              create: [
                {
                  title: 'General Knowledge Quiz',
                  slug: slugify('General Knowledge Quiz', { lower: true }),
                  description: 'A quiz to test your general knowledge skills.',
                  user_uuid: user_uuid,
                  questions: {
                    create: [
                      {
                        number: '1',
                        text: 'What is the capital city of Japan?',
                        choices: {
                          create: [
                            { is_correct: false, text: 'Beijing' },
                            { is_correct: true, text: 'Tokyo' },
                            { is_correct: false, text: 'Seoul' },
                            { is_correct: false, text: 'Bangkok' },
                          ],
                        },
                        explanation: 'Tokyo is the capital city of Japan.',
                      },
                      {
                        number: '2',
                        text: 'Which planet is known as the Red Planet?',
                        choices: {
                          create: [
                            { is_correct: false, text: 'Venus' },
                            { is_correct: false, text: 'Jupiter' },
                            { is_correct: true, text: 'Mars' },
                            { is_correct: false, text: 'Saturn' },
                          ],
                        },
                        explanation: 'Mars is known as the Red Planet.',
                      },
                    ],
                  },
                },
                {
                  title: 'Science and Nature Quiz',
                  slug: slugify('Science and Nature Quiz', { lower: true }),
                  description: 'Test your knowledge of science and nature.',
                  user_uuid: user_uuid,
                  questions: {
                    create: [
                      {
                        number: '1',
                        text: 'What is the chemical symbol for water?',
                        choices: {
                          create: [
                            { is_correct: true, text: 'H2O' },
                            { is_correct: false, text: 'O2' },
                            { is_correct: false, text: 'CO2' },
                            { is_correct: false, text: 'H2' },
                          ],
                        },
                        explanation: 'The chemical symbol for water is H2O.',
                      },
                      {
                        number: '2',
                        text: 'Which gas do plants absorb from the atmosphere?',
                        choices: {
                          create: [
                            { is_correct: false, text: 'Oxygen' },
                            { is_correct: false, text: 'Nitrogen' },
                            { is_correct: true, text: 'Carbon Dioxide' },
                            { is_correct: false, text: 'Hydrogen' },
                          ],
                        },
                        explanation:
                          'Plants absorb carbon dioxide from the atmosphere.',
                      },
                    ],
                  },
                },
                {
                  title: 'History Quiz',
                  slug: slugify('History Quiz', { lower: true }),
                  description: 'A quiz to test your knowledge of history.',
                  user_uuid: user_uuid,
                  questions: {
                    create: [
                      {
                        number: '1',
                        text: 'Who was the first president of the United States?',
                        choices: {
                          create: [
                            { is_correct: true, text: 'George Washington' },
                            { is_correct: false, text: 'Thomas Jefferson' },
                            { is_correct: false, text: 'Abraham Lincoln' },
                            { is_correct: false, text: 'John Adams' },
                          ],
                        },
                        explanation:
                          'George Washington was the first president of the United States.',
                      },
                      {
                        number: '2',
                        text: 'In which year did World War II end?',
                        choices: {
                          create: [
                            { is_correct: false, text: '1942' },
                            { is_correct: true, text: '1945' },
                            { is_correct: false, text: '1939' },
                            { is_correct: false, text: '1950' },
                          ],
                        },
                        explanation: 'World War II ended in 1945.',
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            name: 'Mathematics Section',
            slug: slugify('Mathematics Section', { lower: true }),
            description: 'Section of mathematics questions',
            user_uuid: user_uuid,
            quizzes: {
              create: [
                {
                  title: 'Mathematics Quiz',
                  slug: slugify('Mathematics Quiz', { lower: true }),
                  description: 'A quiz to test your mathematics skills.',
                  user_uuid: user_uuid,
                  questions: {
                    create: [
                      {
                        number: '1',
                        text: 'What is 2 + 2?',
                        choices: {
                          create: [
                            { is_correct: true, text: '4' },
                            { is_correct: false, text: '3' },
                            { is_correct: false, text: '5' },
                            { is_correct: false, text: '6' },
                          ],
                        },
                        explanation: '2 + 2 equals 4.',
                      },
                      {
                        number: '2',
                        text: 'What is the square root of 16?',
                        choices: {
                          create: [
                            { is_correct: true, text: '4' },
                            { is_correct: false, text: '3' },
                            { is_correct: false, text: '5' },
                            { is_correct: false, text: '6' },
                          ],
                        },
                        explanation: 'The square root of 16 is 4.',
                      },
                    ],
                  },
                },
                {
                  title: 'Geography Quiz',
                  slug: slugify('Geography Quiz', { lower: true }),
                  description: 'A quiz to test your geography knowledge.',
                  user_uuid: user_uuid,
                  questions: {
                    create: [
                      {
                        number: '1',
                        text: 'What is the largest continent?',
                        choices: {
                          create: [
                            { is_correct: true, text: 'Asia' },
                            { is_correct: false, text: 'Africa' },
                            { is_correct: false, text: 'Europe' },
                            { is_correct: false, text: 'North America' },
                          ],
                        },
                        explanation: 'Asia is the largest continent.',
                      },
                      {
                        number: '2',
                        text: 'Which country has the most population?',
                        choices: {
                          create: [
                            { is_correct: true, text: 'China' },
                            { is_correct: false, text: 'India' },
                            { is_correct: false, text: 'USA' },
                            { is_correct: false, text: 'Indonesia' },
                          ],
                        },
                        explanation: 'China has the most population.',
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            name: 'Literature and Art Section',
            slug: slugify('Literature and Art Section', { lower: true }),
            description: 'Section of literature and art questions',
            user_uuid: user_uuid,
            quizzes: {
              create: [
                {
                  title: 'Literature Quiz',
                  slug: slugify('Literature Quiz', { lower: true }),
                  description: 'A quiz to test your literature knowledge.',
                  user_uuid: user_uuid,
                  questions: {
                    create: [
                      {
                        number: '1',
                        text: 'Who wrote "Romeo and Juliet"?',
                        choices: {
                          create: [
                            { is_correct: true, text: 'William Shakespeare' },
                            { is_correct: false, text: 'Charles Dickens' },
                            { is_correct: false, text: 'Mark Twain' },
                            { is_correct: false, text: 'Jane Austen' },
                          ],
                        },
                        explanation:
                          '"Romeo and Juliet" was written by William Shakespeare.',
                      },
                      {
                        number: '2',
                        text: 'What is the title of the first Harry Potter book?',
                        choices: {
                          create: [
                            {
                              is_correct: true,
                              text: "Harry Potter and the Philosopher's Stone",
                            },
                            {
                              is_correct: false,
                              text: 'Harry Potter and the Chamber of Secrets',
                            },
                            {
                              is_correct: false,
                              text: 'Harry Potter and the Prisoner of Azkaban',
                            },
                            {
                              is_correct: false,
                              text: 'Harry Potter and the Goblet of Fire',
                            },
                          ],
                        },
                        explanation:
                          'The first Harry Potter book is "Harry Potter and the Philosopher\'s Stone".',
                      },
                    ],
                  },
                },
                {
                  title: 'Art Quiz',
                  slug: slugify('Art Quiz', { lower: true }),
                  description: 'A quiz to test your art knowledge.',
                  user_uuid: user_uuid,
                  questions: {
                    create: [
                      {
                        number: '1',
                        text: 'Who painted the Mona Lisa?',
                        choices: {
                          create: [
                            { is_correct: true, text: 'Leonardo da Vinci' },
                            { is_correct: false, text: 'Vincent van Gogh' },
                            { is_correct: false, text: 'Pablo Picasso' },
                            { is_correct: false, text: 'Claude Monet' },
                          ],
                        },
                        explanation:
                          'The Mona Lisa was painted by Leonardo da Vinci.',
                      },
                      {
                        number: '2',
                        text: 'What is the art style of "The Persistence of Memory" by Salvador Dalí?',
                        choices: {
                          create: [
                            { is_correct: true, text: 'Surrealism' },
                            { is_correct: false, text: 'Impressionism' },
                            { is_correct: false, text: 'Cubism' },
                            { is_correct: false, text: 'Realism' },
                          ],
                        },
                        explanation:
                          '"The Persistence of Memory" is a famous surrealist painting by Salvador Dalí.',
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.tryout.create({
    data: {
      title: 'Advanced Tryout',
      slug: slugify('Advanced Tryout', { lower: true }),
      description: 'An advanced tryout for experienced users.',
      user_uuid: user_uuid,
      sections: {
        create: [
          {
            name: 'Advanced Section 1',
            slug: slugify('Advanced Section 1', { lower: true }),
            description: 'First advanced Section of questions',
            user_uuid: user_uuid,
            quizzes: {
              create: [
                {
                  title: 'Advanced Mathematics Quiz',
                  slug: slugify('Advanced Mathematics Quiz', { lower: true }),
                  description:
                    'A quiz to test your advanced mathematics skills.',
                  user_uuid: user_uuid,
                  questions: {
                    create: [
                      {
                        number: '1',
                        text: 'What is the derivative of x^2?',
                        choices: {
                          create: [
                            { is_correct: true, text: '2x' },
                            { is_correct: false, text: 'x' },
                            { is_correct: false, text: 'x^2' },
                            { is_correct: false, text: '2' },
                          ],
                        },
                        explanation: 'The derivative of x^2 is 2x.',
                      },
                      {
                        number: '2',
                        text: 'What is the integral of 1/x?',
                        choices: {
                          create: [
                            { is_correct: true, text: 'ln|x|' },
                            { is_correct: false, text: 'x' },
                            { is_correct: false, text: '1/x' },
                            { is_correct: false, text: 'e^x' },
                          ],
                        },
                        explanation: 'The integral of 1/x is ln|x|.',
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            name: 'Advanced Section 2',
            slug: slugify('Advanced Section 2', { lower: true }),
            description: 'Second advanced Section of questions',
            user_uuid: user_uuid,
            quizzes: {
              create: [
                {
                  title: 'Advanced Physics Quiz',
                  slug: slugify('Advanced Physics Quiz', { lower: true }),
                  description:
                    'A quiz to test your advanced physics knowledge.',
                  user_uuid: user_uuid,
                  questions: {
                    create: [
                      {
                        number: '1',
                        text: 'What is the speed of light in vacuum?',
                        choices: {
                          create: [
                            { is_correct: true, text: '299,792,458 m/s' },
                            { is_correct: false, text: '150,000,000 m/s' },
                            { is_correct: false, text: '300,000,000 m/s' },
                            { is_correct: false, text: '299,792,000 m/s' },
                          ],
                        },
                        explanation:
                          'The speed of light in vacuum is 299,792,458 meters per second.',
                      },
                      {
                        number: '2',
                        text: 'Who developed the theory of relativity?',
                        choices: {
                          create: [
                            { is_correct: true, text: 'Albert Einstein' },
                            { is_correct: false, text: 'Isaac Newton' },
                            { is_correct: false, text: 'Galileo Galilei' },
                            { is_correct: false, text: 'Nikola Tesla' },
                          ],
                        },
                        explanation:
                          'Albert Einstein developed the theory of relativity.',
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            name: 'Advanced Section 3',
            slug: slugify('Advanced Section 3', { lower: true }),
            description: 'Third advanced Section of questions',
            user_uuid: user_uuid,
            quizzes: {
              create: [
                {
                  title: 'Advanced Chemistry Quiz',
                  slug: slugify('Advanced Chemistry Quiz', { lower: true }),
                  description:
                    'A quiz to test your advanced chemistry knowledge.',
                  user_uuid: user_uuid,
                  questions: {
                    create: [
                      {
                        number: '1',
                        text: 'What is the molecular formula of glucose?',
                        choices: {
                          create: [
                            { is_correct: true, text: 'C6H12O6' },
                            { is_correct: false, text: 'C12H22O11' },
                            { is_correct: false, text: 'C6H6' },
                            { is_correct: false, text: 'CH4' },
                          ],
                        },
                        explanation:
                          'The molecular formula of glucose is C6H12O6.',
                      },
                      {
                        number: '2',
                        text: 'What is the pH of a neutral solution?',
                        choices: {
                          create: [
                            { is_correct: true, text: '7' },
                            { is_correct: false, text: '0' },
                            { is_correct: false, text: '14' },
                            { is_correct: false, text: '1' },
                          ],
                        },
                        explanation: 'The pH of a neutral solution is 7.',
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.tryout.create({
    data: {
      title: 'Intermediate Tryout',
      slug: slugify('Intermediate Tryout', { lower: true }),
      description: 'An intermediate tryout for users with some experience.',
      user_uuid: user_uuid,
      sections: {
        create: [
          {
            name: 'Intermediate Section 1',
            slug: slugify('Intermediate Section 1', { lower: true }),
            description: 'First intermediate Section of questions',
            user_uuid: user_uuid,
            quizzes: {
              create: [
                {
                  title: 'Intermediate History Quiz',
                  slug: slugify('Intermediate History Quiz', { lower: true }),
                  description:
                    'A quiz to test your intermediate history knowledge.',
                  user_uuid: user_uuid,
                  questions: {
                    create: [
                      {
                        number: '1',
                        text: 'Who was the second president of the United States?',
                        choices: {
                          create: [
                            { is_correct: true, text: 'John Adams' },
                            { is_correct: false, text: 'Thomas Jefferson' },
                            { is_correct: false, text: 'James Madison' },
                            { is_correct: false, text: 'George Washington' },
                          ],
                        },
                        explanation:
                          'John Adams was the second president of the United States.',
                      },
                      {
                        number: '2',
                        text: 'In which year did the American Civil War begin?',
                        choices: {
                          create: [
                            { is_correct: true, text: '1861' },
                            { is_correct: false, text: '1865' },
                            { is_correct: false, text: '1850' },
                            { is_correct: false, text: '1870' },
                          ],
                        },
                        explanation: 'The American Civil War began in 1861.',
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            name: 'Intermediate Section 2',
            slug: slugify('Intermediate Section 2', { lower: true }),
            description: 'Second intermediate Section of questions',
            user_uuid: user_uuid,
            quizzes: {
              create: [
                {
                  title: 'Intermediate Science Quiz',
                  slug: slugify('Intermediate Science Quiz', { lower: true }),
                  description:
                    'A quiz to test your intermediate science knowledge.',
                  user_uuid: user_uuid,
                  questions: {
                    create: [
                      {
                        number: '1',
                        text: 'What is the chemical symbol for gold?',
                        choices: {
                          create: [
                            { is_correct: true, text: 'Au' },
                            { is_correct: false, text: 'Ag' },
                            { is_correct: false, text: 'Pb' },
                            { is_correct: false, text: 'Fe' },
                          ],
                        },
                        explanation: 'The chemical symbol for gold is Au.',
                      },
                      {
                        number: '2',
                        text: 'What is the boiling point of water at sea level?',
                        choices: {
                          create: [
                            { is_correct: true, text: '100°C' },
                            { is_correct: false, text: '90°C' },
                            { is_correct: false, text: '110°C' },
                            { is_correct: false, text: '120°C' },
                          ],
                        },
                        explanation:
                          'The boiling point of water at sea level is 100°C.',
                      },
                    ],
                  },
                },
              ],
            },
          },
          {
            name: 'Intermediate Section 3',
            slug: slugify('Intermediate Section 3', { lower: true }),
            description: 'Third intermediate Section of questions',
            user_uuid: user_uuid,
            quizzes: {
              create: [
                {
                  title: 'Intermediate Geography Quiz',
                  slug: slugify('Intermediate Geography Quiz', { lower: true }),
                  description:
                    'A quiz to test your intermediate geography knowledge.',
                  user_uuid: user_uuid,
                  questions: {
                    create: [
                      {
                        number: '1',
                        text: 'What is the capital city of Canada?',
                        choices: {
                          create: [
                            { is_correct: true, text: 'Ottawa' },
                            { is_correct: false, text: 'Toronto' },
                            { is_correct: false, text: 'Vancouver' },
                            { is_correct: false, text: 'Montreal' },
                          ],
                        },
                        explanation: 'The capital city of Canada is Ottawa.',
                      },
                      {
                        number: '2',
                        text: 'Which river is the longest in the world?',
                        choices: {
                          create: [
                            { is_correct: true, text: 'Nile' },
                            { is_correct: false, text: 'Amazon' },
                            { is_correct: false, text: 'Yangtze' },
                            { is_correct: false, text: 'Mississippi' },
                          ],
                        },
                        explanation:
                          'The Nile is the longest river in the world.',
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  });
}

async function main() {
  await prisma.$transaction([
    prisma.answer.deleteMany(),
    prisma.choice.deleteMany(),
    prisma.question.deleteMany(),
    prisma.quizAttempt.deleteMany(),
    prisma.quiz.deleteMany(),
    prisma.section.deleteMany(),
    prisma.tryout.deleteMany(),
    prisma.paymentReceipt.deleteMany(),
    prisma.paymentLog.deleteMany(),
    prisma.paymentRequest.deleteMany(),
    prisma.subscription.deleteMany(),
    prisma.subscriptionPlan.deleteMany(),
    prisma.user.deleteMany(),
    prisma.role.deleteMany(),
  ]);

  const { adminRole, userRole } = await generateRole();

  await generateUser(adminRole);
  await generateUser(userRole);

  const adminUser = await prisma.user.findUnique({
    where: {
      email: 'admin@example.com',
    },
  });

  await generateSubscriptionPlans();
  await generateTryout(adminUser.uuid);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
