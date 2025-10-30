const SLACK_TOKEN = process.env.SLACK_BOT_TOKEN;
const CHANNEL = 'the-italian-job'; // Private channel ID

async function sendSlackMessage(text) {
  const response = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${SLACK_TOKEN}`,
    },
    body: JSON.stringify({
      channel: CHANNEL,
      text,
    }),
  });

  const data = await response.json();

  if (!data.ok) {
    throw new Error(`Slack API error: ${data.error}`);
  }
}

async function main() {
  const response = await fetch('http://cerbero-pmg.duckdns.org:8088/health');
  if (response.status !== 200) {
    await sendSlackMessage(
      `🚨 Cerbero health check failed 🚨 
      
      *${response.status}* - *${response.statusText}*`,
    );
  }
}

main().catch(console.error);

// sendSlackMessage('Hello from Cerbero watchdog 🚀').catch(console.error);
