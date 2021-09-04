def get_form_messages(form):

    messages = set()

    for key in form.errors.as_data():
        to_append = str(form.errors.as_data()[key][0])[2:-2]
        messages.add("All fields are required." if to_append ==
                     "This field is required." else to_append)

    return list(messages)


def get_username(username):
    return str(username)[0:13] + "…" if len(str(username)) > 14 else str(username)
