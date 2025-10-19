import {PrismaClient} from '@/generated/prisma/client';
import {NextRequest, NextResponse} from 'next/server';

interface ReportData {
    uuid: string;
    name: string;
    serverAddress: string;
    refer: string;
    latency: number;
}

export async function POST(req: NextRequest) {
    const prisma = new PrismaClient();

    const data = (await req.json()) as ReportData;

    const existUser = await prisma.user.findFirst({where: {uuid: data.uuid}});
    if (!existUser) {
        await prisma.user.create({
            data: {
                uuid: data.uuid,
                name: data.name,
                createRefer: data.refer,
                lastServerAddress: data.refer,
                createAt: new Date(),
                updates: 0,
                lastLatency: data.latency,
            },
        });

        await prisma.$disconnect();
        return NextResponse.json({
            status: 'created',
        });
    }

    await prisma.user.update({
        where: {
            uuid: data.uuid,
        },
        data: {
            name: data.name,
            lastServerAddress: data.serverAddress,
            updates: existUser.updates + 1,
            lastLatency: data.latency,
        },
    });

    await prisma.$disconnect();
    return NextResponse.json({
        status: 'updated',
    });
}
