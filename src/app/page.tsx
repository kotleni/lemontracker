import {PrismaClient} from '@/generated/prisma';
import {cn} from '@/lib/utils';
import {LatencyChart} from '@/components/latency-chart';

const slugify = (text: string) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
};

export default async function Home() {
    const prisma = new PrismaClient();

    const players = await prisma.user.findMany({
        take: 200,
        orderBy: {
            updates: 'desc',
        },
    });

    await prisma.$disconnect();

    const playersByServer = players.reduce(
        (acc, player) => {
            const server = player.lastServerAddress || 'Unknown Server';

            if (!acc[server]) {
                acc[server] = [];
            }

            acc[server].push(player);

            return acc;
        },
        {} as Record<string, typeof players>,
    );

    const serverAddresses = Object.keys(playersByServer);

    return (
        <div className="flex flex-col w-full gap-8 p-4">
            <nav className="bg-gray-900/80 p-4 rounded-lg border border-gray-700">
                <h3 className="text-lg font-bold mb-2">Jump to Server</h3>
                <div className="flex flex-row flex-wrap gap-2">
                    {serverAddresses.map(serverAddress => (
                        <a
                            key={serverAddress}
                            href={`#${slugify(serverAddress)}`}
                            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-sm transition-colors"
                        >
                            {serverAddress}
                        </a>
                    ))}
                </div>
            </nav>

            {Object.keys(playersByServer).map(serverAddress => (
                <div key={serverAddress} className="flex flex-col gap-2">
                    <h2 className="text-xl font-bold border-b pb-1">
                        {serverAddress}
                    </h2>

                    <LatencyChart players={playersByServer[serverAddress]} />

                    <div className="flex flex-col gap-2 pl-4">
                        {playersByServer[serverAddress].map(player => (
                            <div
                                key={player.id}
                                id={slugify(serverAddress)}
                                className="flex flex-row flex-wrap w-full justify-start items-center gap-x-4 gap-y-1" // Improved wrapping and alignment
                            >
                                <p className="font-semibold w-40 truncate">
                                    {player.name}
                                </p>
                                <p className="text-sm text-gray-300 w-48">
                                    ({player.uuid})
                                </p>
                                <p className="text-sm">
                                    Refer: {player.createRefer}
                                </p>
                                <p
                                    className={cn(
                                        'text-sm',
                                        player.lastLatency > 0
                                            ? ''
                                            : 'line-through text-gray-400',
                                    )}
                                >
                                    Latency: {player.lastLatency} ms
                                </p>
                                <p className="text-sm">
                                    Updates: {player.updates}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
