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
  } catch {}
});



async function insertSignatureFromButton(event) {
  try {
    Office.context.mailbox.item.notificationMessages.replaceAsync("sig-status", {
      type: Office.MailboxEnums.ItemNotificationMessageType.InformationalMessage,
      message: "Button clicked",
      persistent: false,
    });
    const email = Office.context.mailbox.userProfile.emailAddress;
    const res = await fetch(
      `https://simtech-email-signature.vercel.app/api/signature?email=${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: {
          "x-sig-auth": "super-long-random-token-here-123456789",
        },
      }
    );
    if (!res.ok) {
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
          Office.context.mailbox.item.notificationMessages.replaceAsync("sig-status", {
            type: Office.MailboxEnums.ItemNotificationMessageType.InformationalMessage,
            message: `Failed to insert signature: ${asyncResult.error?.message ?? "Unknown error"}`,
            persistent: false,
          });
        }
        event.completed();
      }
    );
  } catch {
    Office.context.mailbox.item.notificationMessages.replaceAsync("sig-status", {
      type: Office.MailboxEnums.ItemNotificationMessageType.InformationalMessage,
      message: "Error inserting signature",
      persistent: false,
    });
    event.completed();
  }
}

window.insertSignatureFromButton = insertSignatureFromButton;

// Register the button function with Office.actions (required for ExecuteFunction)
if (Office.actions) {
  Office.actions.associate("insertSignatureFromButton", insertSignatureFromButton);
}

