import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataRepositoryService {}

// structure of database:
//
//
//  ----+
//      |
//      +--  UserData
//      |    +-- email, name, avatar url
//      |    +-- team_memberships: string[](club/teams/) => teamMember
//      |    +-- owner_of: string[](club) => clubs
//      |    +-- user preferences
//      +--  team memberships
//      |    +-- name, avatar url
//      |    +-- events data
//      +--  Clubs
//      |    +-- name
//      |    +-- admin
//      |    +-- billing stuff
//      |    +-- type: sport | music | other
//      |    +-- members: string[]
//      |    +-- trainers: string[]
//      |    +-- Teams
//      |        +-- members: string[]
//      |        +-- trainers: string[]
//      |        +-- preferences
//      |        +-- Events
//      |            +-- name
//      |            +-- location
//      |            +-- date
//      |            +-- duration
//      |            +-- signed up users: string[]
//      |            +-- signed up coaches: string[]
//      |            +-- additional infoCl
