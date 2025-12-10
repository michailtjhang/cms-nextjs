require('dotenv').config();
const { execSync } = require('child_process');

const command = process.argv.slice(2).join(' ') || 'prisma db push';

console.log('DATABASE_URL is set:', !!process.env.DATABASE_URL);
console.log('Running:', `npx ${command}`);

try {
    execSync(`npx ${command}`, {
        stdio: 'inherit',
        env: { ...process.env }
    });
} catch (error) {
    process.exit(1);
}
