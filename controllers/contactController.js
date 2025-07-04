const Contact = require("../models/Contact");

const identifyUser = async (req, res) => {
  const { email, phoneNumber } = req.body;

  // At least one of email or phone must be present
  if (!email && !phoneNumber) {
    return res.status(400).json({ error: "Email or phoneNumber is required" });
  }

  // query so that null should not be consider from same group
  let query = [];
  if (email) query.push({ email });
  if (phoneNumber) query.push({ phoneNumber });

  const matchedContacts =
    query.length > 0 ? await Contact.find({ $or: query }) : [];

  //  If no contact matched, create a new primary
  if (matchedContacts.length === 0) {
    const newContact = await Contact.create({
      email,
      phoneNumber,
      linkPrecedence: "primary",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return res.json({
      contact: {
        primaryContactId: newContact._id,
        emails: [email],
        phoneNumbers: [phoneNumber],
        secondaryContactIds: [],
      },
    });
  }

  // Determine the primary contact
  let primaryContact = null;
  const primaryContacts = matchedContacts.filter(
    (c) => c.linkPrecedence === "primary"
  );

  if (primaryContacts.length > 0) {
    // Sort to get oldest primary
    primaryContacts.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
    primaryContact = primaryContacts[0];

    // all newer primaries to secondary
    const toDemote = primaryContacts.filter(
      (c) => c._id.toString() !== primaryContact._id.toString()
    );

    await Promise.all(
      toDemote.map(async (contact) => {
        contact.linkPrecedence = "secondary";
        contact.linkedId = primaryContact._id;
        contact.updatedAt = new Date();
        await contact.save();
      })
    );
  } else {
    // no primary found, pick oldest contact
    matchedContacts.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
    primaryContact = matchedContacts[0];
  }

  //  Check if this exact user already exists
  const alreadyExists = matchedContacts.find(
    (c) => c.email === email && c.phoneNumber === phoneNumber
  );

  if (!alreadyExists) {
    await Contact.create({
      email,
      phoneNumber,
      linkedId: primaryContact._id,
      linkPrecedence: "secondary",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  // Fetch all contacts linked to the primary
  const allContacts = await Contact.find({
    $or: [{ _id: primaryContact._id }, { linkedId: primaryContact._id }],
  });

  // Aggregate results
  const emails = [...new Set(allContacts.map((c) => c.email).filter(Boolean))];

  const phoneNumbers = [
    ...new Set(allContacts.map((c) => c.phoneNumber).filter(Boolean)),
  ];
  const secondaryContactIds = allContacts
    .filter((c) => c.linkPrecedence === "secondary")
    .map((c) => c._id);

  return res.json({
    contact: {
      primaryContactId: primaryContact._id,
      emails,
      phoneNumbers,
      secondaryContactIds,
    },
  });
};

module.exports = identifyUser;
