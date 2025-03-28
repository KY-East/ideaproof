export type IdeaProof = {
  "version": "0.1.0",
  "name": "ideaproof",
  "instructions": [
    {
      "name": "recordIdea",
      "accounts": [
        {
          "name": "ideaRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "submitter",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "hash",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "IdeaRecord",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "hash",
            "type": "string"
          },
          {
            "name": "submitter",
            "type": "publicKey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "HashTooLong",
      "msg": "Hash string must not exceed 64 characters"
    }
  ]
};

export const IDL: IdeaProof = {
  "version": "0.1.0",
  "name": "ideaproof",
  "instructions": [
    {
      "name": "recordIdea",
      "accounts": [
        {
          "name": "ideaRecord",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "submitter",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "hash",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "IdeaRecord",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "hash",
            "type": "string"
          },
          {
            "name": "submitter",
            "type": "publicKey"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "HashTooLong",
      "msg": "Hash string must not exceed 64 characters"
    }
  ]
}; 