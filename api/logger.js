export default async function handler(req, res) {
    const { userToken, logText, rawLog, tab } = req.body;

    const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
    const FORUM_CHANNEL_ID = process.env.FORUM_CHANNEL_ID;
    const GUILD_ID = process.env.GUILD_ID;

    try {
        const activeThreadsRes = await fetch(
            `https://discord.com/api/v10/guilds/${GUILD_ID}/threads/active`,
            { headers: { Authorization: `Bot ${BOT_TOKEN}` } }
        );
        const { threads } = await activeThreadsRes.json();

        let threadId = threads?.find(t => t.name === userToken)?.id;

        if (!threadId) {
            const createThreadRes = await fetch(
                `https://discord.com/api/v10/channels/${FORUM_CHANNEL_ID}/threads`,
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bot ${BOT_TOKEN}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: userToken,
                        auto_archive_duration: 1440,
                        message: { content: `Начало логов для: ${userToken}` }
                    }),
                }
            );
            const newThread = await createThreadRes.json();
            threadId = newThread.id;
        }

        const discordFormData = new FormData();
        discordFormData.append('payload_json', JSON.stringify({
            embeds: [{
                description: '### ' + logText,
                color: 0x4cc299,
                timestamp: new Date().toISOString(),
                fields: [
                    {
                        name: "Тип события",
                        value: `\`${rawLog?.type || 'unknown'}\``,
                        inline: true
                    },
                    {
                        name: "Квест",
                        value: `\`${rawLog?.args?.name || 'N/A'}\``,
                        inline: true
                    }
                ]
            }]
        }));
        const blob = new Blob([JSON.stringify(tab, null, 2)], { type: 'application/json' });
        discordFormData.append('files[0]', blob, `${tab.tabID}.json`);

        await fetch(`https://discord.com/api/v10/channels/${threadId}/messages`, {
            method: 'POST',
            headers: { 'Authorization': `Bot ${BOT_TOKEN}` },
            body: discordFormData
        });

        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}