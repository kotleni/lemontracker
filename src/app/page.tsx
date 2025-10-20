import {PrismaClient} from '@/generated/prisma';

export default async function Home() {
    const prisma = new PrismaClient();

    const users = await prisma.user.findMany({
        take: 200,
        orderBy: {
            updates: 'desc',
        },
    });

    await prisma.$disconnect();

    return (
        <div className="flex flex-col w-full gap-8 p-4">
            <div className="flex flex-col gap-2">
                <div className="p-2">
                    <p>Registered: {users.length}</p>
                    <p>
                        Updates:{' '}
                        {users.map(a => a.updates).reduce((a, b) => a + b)}
                    </p>
                </div>

                <div className="flex flex-col gap-2 pl-4">
                    {users.map(player => (
                        <div
                            key={player.id}
                            className="flex flex-row flex-wrap w-full justify-start items-center gap-x-4 gap-y-1" // Improved wrapping and alignment
                        >
                            <p className="font-semibold w-40 truncate">
                                {player.name}
                            </p>
                            <p className="text-sm">
                                Refer: {player.createRefer}
                            </p>
                            <p className="text-sm">Updates: {player.updates}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
