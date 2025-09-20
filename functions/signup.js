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
  return new Response(`Hello, ${email}`);
}
