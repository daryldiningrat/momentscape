# Momentscape Database ERD

```mermaid
erDiagram
    USER ||--o{ PROJECT : owns
    USER ||--o{ TEMPLATE : creates
    PROJECT ||--o{ INVITATION : has
    TEMPLATE ||--o{ INVITATION : used_by
    INVITATION ||--o{ GUEST : includes
    GUEST ||--o{ RSVP : submits

    USER {
        uuid id PK
        string email UK
        string name
        string password
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }

    PROJECT {
        uuid id PK
        uuid user_id FK
        string title
        string description
        datetime event_date
        string location
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }

    TEMPLATE {
        uuid id PK
        uuid user_id FK
        string name
        text content
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }

    INVITATION {
        uuid id PK
        uuid project_id FK
        uuid template_id FK
        text message
        string status
        datetime sent_at
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }

    GUEST {
        uuid id PK
        uuid invitation_id FK
        string name
        string email
        string phone
        string personalized_link UK
        enum rsvp_status
        int view_count
        datetime last_viewed_at
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }

    RSVP {
        uuid id PK
        uuid guest_id FK
        enum status
        text dietary_restrictions
        int plus_ones
        text message
        datetime created_at
        datetime updated_at
        datetime deleted_at
    }
```

## Relationships

- A `User` can own many `Projects` and create many `Templates`.
- A `Project` can have many `Invitations`.
- An `Invitation` may use one `Template`.
- An `Invitation` includes many `Guests`.
- A `Guest` can submit multiple `RSVPs` over time.

## Indexes

- `users.email`
- `users.deleted_at`
- `projects.user_id`, `projects.deleted_at`
- `templates.user_id`, `templates.deleted_at`
- `invitations.project_id`, `invitations.template_id`, `invitations.deleted_at`
- `guests.invitation_id`, `guests.email`, `guests.personalized_link`, `guests.rsvp_status`, `guests.deleted_at`
- `rsvps.guest_id`, `rsvps.status`, `rsvps.deleted_at`

## Soft Deletes

All models include a `deleted_at` timestamp. Records with a non-null `deleted_at` are considered deleted.
