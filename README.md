# Application name

# Theme of the app

An internal tool of an investigator group to manage and download their database of FASTA files.

---

## Roles
Admin:
- Only the admin can see and manage the users.
- Complete C.R.U.D. operations.

Visitor / Anonymous:
- Read-only operations.

Investigator:
- C.R.U. operations on the files.

## DB tables
- users
- roles
- fasta_files (id,name,size,upload_date,file_path)
- species
- fasta_storage (The join of the species and fasta_files.)

## App tables
1. Users (admin only!):
    - id(will be added by the database), username, password, first name, last name, registration date, ACTIONS

2. File Storage:
    - File ID, File name, Taxonomy ID, Taxonomy Name, File description, File Size, Upload date, ACTIONS (Buttons for the corresponding operations of the user's role.)

---

# Angular

## Navbar menus
- Home
- About the application (motivation).
- About members
- Login
- Logout
- Register
- Users (after login, admin only)
- File Storage

## Components
- Home
- AboutApp ??
- AboutMembers
- Login
- Logout
- Register
- Users
- FileStorage

## Services
- FileUpload
- CredentialValidation (For registration and login.)
- SessionHandler ( Checking if the user is logged in or not. + Do the logout.)

## Directives
- PasswordConfirmValidation
- FastaFileValidation
