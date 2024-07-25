const { connect } = require("../config/mongodb");

const data = [
  {
    content: "memasak",
    tags: ['cooks', 'memasak', 'makanan'],
    imgUrl: "https://placehold.co/600x400",
    authorId: "667ac785ac5ae423c2572017",
    comments: [
      {
        content: "wah keliatanya enak",
        username: "jennie",
        createdAt: new Date("2024-06-22T21:15:32.405+0700"),
        updatedAt: new Date("2024-06-22T21:15:32.405+0700"),
      },
    ],
    likes: [
      {
        username: "dwi",
        createdAt: new Date("2024-06-22T21:15:32.405+0700"),
        updatedAt: new Date("2024-06-25T21:15:32.405+0700"),
      },
    ],
    createdAt: new Date("2024-06-22T21:15:32.405+0700"),
    updatedAt: new Date("2024-06-25T21:15:32.405+0700"),
  },
  {
    content: "memancing",
    tags: ["fish"],
    imgUrl: "https://placehold.co/600x400",
    authorId: "667ac785ac5ae423c2572017",
    comments: [
      {
        content: "strike wakkk!",
        username: "jono",
        createdAt: new Date("2024-06-22T21:15:32.405+0700"),
        updatedAt: new Date("2024-06-22T21:15:32.405+0700"),
      },
    ],
    likes: [
      {
        username: "jono",
        createdAt: new Date("2024-06-22T21:15:32.405+0700"),
        updatedAt: new Date("2024-06-25T21:15:32.405+0700"),
      },
    ],
    createdAt: new Date("2024-06-22T21:15:32.405+0700"),
    updatedAt: new Date("2024-06-25T21:15:32.405+0700"),
  },
];

async function seedPost() {
  try {
    console.log('loading seed...');
    const db = await connect();
    await db.collection("posts").insertMany(data);
    console.log("YES! SUCCESS SHIT POST");
  } catch (error) {
    console.log(error, "<-- error seed post");
  } finally {
    process.exit();
  }

}

seedPost();
