import {PrismaClient} from '@/generated/prisma/client';
import {NextRequest, NextResponse} from 'next/server';

interface ReportData {
    name: string;
    refer: string;
}

export async function POST(req: NextRequest) {
    const prisma = new PrismaClient();

    const data = (await req.json()) as ReportData;

    const existUser = await prisma.user.findFirst({where: {name: data.name}});
    if (!existUser) {
        await prisma.user.create({
            data: {
                name: data.name,
                createRefer: data.refer,
                createAt: new Date(),
                updates: 0,
            },
        });

        await prisma.$disconnect();
        return NextResponse.json({
            status: 'created',
        });
    }

    await prisma.user.update({
        where: {
            name: data.name,
        },
        data: {
            name: data.name,
            updates: existUser.updates + 1,
        },
    });

    await prisma.$disconnect();
    return NextResponse.json({
        status: 'updated',
    });
}
