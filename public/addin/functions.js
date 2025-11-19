Office.onReady(() => {
  try {
    Office.context.mailbox.item.notificationMessages.replaceAsync("sig-status", {
      type: Office.MailboxEnums.ItemNotificationMessageType.InformationalMessage,
      message: "Add-in runtime loaded",
      persistent: false,
    });
    fetch(
      `https://simtech-email-signature.vercel.app/api/health?source=addin-runtime&ts=${Date.now()}`,
      { cache: "no-store" }
    ).catch(() => {});
    if (Office && Office.actions && typeof Office.actions.associate === "function") {
      Office.actions.associate("onMessageCompose", onMessageCompose);
    }
  } catch {}
});

async function onMessageCompose(event) {
  try {
    Office.context.mailbox.item.notificationMessages.replaceAsync("sig-status", {
      type: Office.MailboxEnums.ItemNotificationMessageType.InformationalMessage,
      message: "Preparing signature...",
      persistent: false,
    });
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
      Office.context.mailbox.item.notificationMessages.replaceAsync("sig-status", {
        type: Office.MailboxEnums.ItemNotificationMessageType.InformationalMessage,
        message: `Signature fetch failed: ${res.status}`,
        persistent: false,
      });
      return event.completed();
    }

    const sigHtml = await res.text();
    if (!sigHtml || !sigHtml.trim()) {
      Office.context.mailbox.item.notificationMessages.replaceAsync("sig-status", {
        type: Office.MailboxEnums.ItemNotificationMessageType.InformationalMessage,
        message: "No signature returned",
        persistent: false,
      });
      return event.completed();
    }

    Office.context.mailbox.item.body.setSignatureAsync(
      sigHtml,
      { coercionType: Office.CoercionType.Html },
      (asyncResult) => {
        if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
          Office.context.mailbox.item.notificationMessages.replaceAsync("sig-status", {
            type: Office.MailboxEnums.ItemNotificationMessageType.InformationalMessage,
            message: "Signature added",
            persistent: false,
          });
        } else {
          console.error("setSignatureAsync failed", asyncResult.error);
          Office.context.mailbox.item.notificationMessages.replaceAsync("sig-status", {
            type: Office.MailboxEnums.ItemNotificationMessageType.InformationalMessage,
            message: `Failed to insert signature: ${asyncResult.error?.message ?? "Unknown error"}`,
            persistent: false,
          });
        }
        event.completed();
      }
    );
  } catch (err) {
    console.error("Error inserting signature", err);
    Office.context.mailbox.item.notificationMessages.replaceAsync("sig-status", {
      type: Office.MailboxEnums.ItemNotificationMessageType.InformationalMessage,
      message: "Error inserting signature",
      persistent: false,
    });
    event.completed();
  }
}

window.onMessageCompose = onMessageCompose;
