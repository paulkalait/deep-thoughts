//This file will store all of the GraphQL query requests.
import { gql } from '@apollo/client'

export const QUERY_THOUGHTS = gql`
query thoughts($username: String){
    thoughts(username: $username){
    _id
    thoughtText
    createdAt
    username
    ractionCount
    reactions{
        _id
        createdAt
        username
        reactionBody
    }
}
}
`