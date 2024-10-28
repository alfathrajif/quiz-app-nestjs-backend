import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import slugify from 'slugify';

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction([
    prisma.answer.deleteMany(),
    prisma.quizAttempt.deleteMany(),
    prisma.choice.deleteMany(),
    prisma.question.deleteMany(),
    prisma.quiz.deleteMany(),
    prisma.user.deleteMany(),
    prisma.role.deleteMany(),
  ]);

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

  const passwordHash = await bcrypt.hash('Password123', 10);

  const adminUser = await prisma.user.create({
    data: {
      name: 'Cassandra Douglas',
      email: 'cassandra@example.com',
      password: passwordHash,
      role_uuid: adminRole.uuid,
    },
  });

  await prisma.user.create({
    data: {
      name: 'Edith Wintheiser',
      email: 'edith@example.com',
      password: passwordHash,
      role_uuid: userRole.uuid,
    },
  });

  // Create multiple quizzes

  await prisma.quiz.create({
    data: {
      title: 'General Knowledge Quiz',
      slug: slugify('General Knowledge Quiz', { lower: true }),
      description: 'A quiz to test your general knowledge skills.',
      user_uuid: adminUser.uuid,
      questions: {
        create: [
          {
            number: '1',
            text: 'What is the capital city of Japan?',
            choices: {
              create: [
                { is_correct: false, choice_text: 'Beijing' },
                { is_correct: true, choice_text: 'Tokyo' },
                { is_correct: false, choice_text: 'Seoul' },
                { is_correct: false, choice_text: 'Bangkok' },
              ],
            },
            explanation: 'Tokyo is the capital city of Japan.',
          },
          {
            number: '2',
            text: 'Which planet is known as the Red Planet?',
            choices: {
              create: [
                { is_correct: false, choice_text: 'Venus' },
                { is_correct: false, choice_text: 'Jupiter' },
                { is_correct: true, choice_text: 'Mars' },
                { is_correct: false, choice_text: 'Saturn' },
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
      user_uuid: adminUser.uuid,
      questions: {
        create: [
          {
            number: '1',
            text: 'What is the chemical symbol for water?',
            choices: {
              create: [
                { is_correct: true, choice_text: 'H2O' },
                { is_correct: false, choice_text: 'O2' },
                { is_correct: false, choice_text: 'CO2' },
                { is_correct: false, choice_text: 'H2' },
              ],
            },
            explanation: 'The chemical symbol for water is H2O.',
          },
          {
            number: '2',
            text: 'Which gas do plants absorb from the atmosphere?',
            choices: {
              create: [
                { is_correct: false, choice_text: 'Oxygen' },
                { is_correct: false, choice_text: 'Nitrogen' },
                { is_correct: true, choice_text: 'Carbon Dioxide' },
                { is_correct: false, choice_text: 'Hydrogen' },
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
      user_uuid: adminUser.uuid,
      questions: {
        create: [
          {
            number: '1',
            text: 'Who was the first president of the United States?',
            choices: {
              create: [
                { is_correct: true, choice_text: 'George Washington' },
                { is_correct: false, choice_text: 'Thomas Jefferson' },
                { is_correct: false, choice_text: 'Abraham Lincoln' },
                { is_correct: false, choice_text: 'John Adams' },
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
                { is_correct: false, choice_text: '1942' },
                { is_correct: true, choice_text: '1945' },
                { is_correct: false, choice_text: '1939' },
                { is_correct: false, choice_text: '1950' },
              ],
            },
            explanation: 'World War II ended in 1945.',
          },
        ],
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
