import {NextResponse} from 'next/server';
import {PrismaClient} from '@/generated/prisma';

export async function GET() {
    const prisma = new PrismaClient();

    const players = await prisma.user.findMany({
        take: 200,
    });

    await prisma.$disconnect();
    return NextResponse.json(players);
}
