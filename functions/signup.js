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
    .prepare("INSERT INTO signup (email) VALUES (?)")
    .bind(email)
    .run();
  if (!success) {
    return new Response("Something went wrong saving your email, please try again!", { status: 500 });
  }
  const redirectUrl = new URL(context.request.url);
  redirectUrl.pathname = "/success";
  redirectUrl.searchParams.set("email", email);
  return Response.redirect(redirectUrl.toString(), 302);
}
