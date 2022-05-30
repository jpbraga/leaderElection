# Leader Election (AWS DynamoDB)
POC of a leader election using AWS DynamoDB and it's conditional transaction to elect a leader and retain leadership across distributed application architecture.

### Usage
You can either use it localy using docker or another tool of your choice, or apply the content of the `k8s` folder in kubernetes (`kubectl apply -f .`).

### Expected behaviour
Across multiple instances only one of them can gain an retain the leadership. Once the leadership is released - either from application failure or it's conclusion - another instance will acquire the leadership.

**Note that the instances can be placed anywhere as long as they can reach the AWS DynamoDB database.**

### Required environment variables
| Name                  | Description                    | Example      |
|-----------------------|--------------------------------|--------------|
| REGION                | AWS DynamoDB region            | us-east-1    |
| LOCK_TABLE_NAME       | AWS DynamoDB table name        | LEADER_TABLE |
| PARTITION_KEY         | AWS DynamoDB partitionKey name | id           |
| AWS_ACCESS_KEY_ID     | AWS service account id         | N/A          |
| AWS_SECRET_ACCESS_KEY | AWS service account secret     | N/A          |

### Permissions
The following permissions are required:
- `dynamodb:DeleteItem`
- `dynamodb:GetItem`
- `dynamodb:PutItem`
- `dynamodb:Scan`
- `dynamodb:UpdateItem`
- `dynamodb:DescribeTable`

## Credits
https://www.npmjs.com/package/dynamodb-lock-client
