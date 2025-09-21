function validEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

export const onRequestPost = async (context) => {
  const data = await context.request.formData();
  const email = data.get("email").trim();
  if (!validEmail(email)) {
    return new Response("Does not look like an email!", { status: 400 });
  }
  const { success } = await context.env.softlaunch_d1
    .prepare("INSERT INTO signup (email) VALUES (?) ON CONFLICT (email) DO NOTHING")
    .bind(email)
    .run();
  if (!success) {
    console.error(`Failed to insert email ${email} into D1`);
    return new Response("Something went wrong saving your email, please try again!", { status: 500 });
  }

  const name = email.match(/^([^@]*)@/)[1];
  const resp = await fetch("https://api.zeptomail.com/v1.1/email", {
    body: JSON.stringify({
      "from": {"address": "no-reply@beginnings.app", "name": "Beginning AI"},
      "to": [{"email_address": {"address": email, "name": name}}],
      "bcc": [{"email_address": {"address": "info@negbeta.com", "name": "Negbeta"}}],
      "subject": "You are on the wait list | Beginnings",
      "htmlbody": "Thank you for signing up to the Beginnings wait list! <i>Your waifu awaits ✨</i>",
    }),
    method: "POST",
    headers: {
      "Authorization": context.env.ZEPTOMAIL_TOKEN,
      "Accept": "application/json",
      "Content-Type": "application/json"
    }
  });
  if (!resp.ok) {
    console.error(`Failed to send confirmation email to ${email}`);
    console.error(resp);
    console.error(await resp.text());
    return new Response("Something went wrong sending you a confirmation email, please try again!", { status: 500 });
  }

  console.log(`Successfully processed email ${email}`);

  const redirectUrl = new URL(context.request.url);
  redirectUrl.pathname = "/success";
  redirectUrl.searchParams.set("email", email);
  return Response.redirect(redirectUrl.toString(), 302);
}
