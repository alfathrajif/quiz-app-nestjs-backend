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
      },
    });
    return customerUser;
  }
}

async function generateQuiz(user_uuid: string) {
  // Create multiple quizzes
  await prisma.quiz.create({
    data: {
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
  });

  await prisma.quiz.create({
    data: {
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
            explanation: 'Plants absorb carbon dioxide from the atmosphere.',
          },
        ],
      },
    },
  });

  await prisma.quiz.create({
    data: {
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
  });
}

async function main() {
  await prisma.$transaction([
    prisma.answer.deleteMany(),
    prisma.quizAttempt.deleteMany(),
    prisma.choice.deleteMany(),
    prisma.question.deleteMany(),
    prisma.quiz.deleteMany(),
    // prisma.user.deleteMany(),
    // prisma.role.deleteMany(),
  ]);

  // const { adminRole, userRole } = await generateRole();

  // await generateUser(adminRole);
  // await generateUser(userRole);

  const adminUser = await prisma.user.findUnique({
    where: {
      email: 'cassandra@example.com',
    },
  });

  await generateQuiz(adminUser.uuid);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
