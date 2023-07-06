import { DynamoDBClient, 
    PutItemCommand,
    ScanCommand} from "@aws-sdk/client-dynamodb";

const dbclient = new DynamoDBClient({region: 'us-east-1'});

// Add new post to table
export const addPost = async (params) => {
    try {
        const postData = await dbclient.send(new PutItemCommand(params));
        console.log("Success - item added or updated", postData);
      } catch (err) {
        console.log("Error", err.stack);
      }
}

// Get all posts 
export const getAllPosts = async () => {
    const params = {
      TableName: "blog-post"
    };
  
    try {
        const response = await dbclient.send(new ScanCommand(params));
        const posts = response.Items.map((item) => {
          return {
            postId: item.id.N,
            postTitle: item.title.S,
            postBody: item.body.S,
            postDate: item.date.S,
          };
        });
      return posts;
    } catch (err) {
      console.error(err);
      throw err;
    }
}
