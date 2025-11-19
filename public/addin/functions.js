Office.onReady(() => {});

async function onMessageCompose(event) {
  try {
    const email = Office.context.mailbox.userProfile.emailAddress;

    const res = await fetch(
      `https://simtech-email-signature.vercel.app/api/signature?email=${encodeURIComponent(
        email
      )}`,
      {
        method: "GET",
        headers: {
          "x-sig-auth": "super-long-random-token-here-123456789",
        },
      }
    );

    if (!res.ok) {
      console.error("Signature fetch failed:", res.status);
      return event.completed();
    }

    const sigHtml = await res.text();
    if (!sigHtml || !sigHtml.trim()) {
      return event.completed();
    }

    Office.context.mailbox.item.body.setSignatureAsync(
      sigHtml,
      { coercionType: Office.CoercionType.Html },
      () => event.completed()
    );
  } catch (err) {
    console.error("Error inserting signature", err);
    event.completed();
  }
}

window.onMessageCompose = onMessageCompose;
