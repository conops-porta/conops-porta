--DATABASE is named ConOps--

--The user table holds encripted password and username and authorization level-- 
CREATE TABLE "user"
(
  "id" SERIAL PRIMARY KEY,
  "username" VARCHAR(80) UNIQUE NOT NULL,
  "password" VARCHAR(1000) NOT NULL,
  "authorization" INT
);

-- Organization table holds all information regarding Organizations--
CREATE TABLE "Organization"
(
	"OrganizationID" SERIAL PRIMARY KEY,
	"OrganizationName" VARCHAR(255) NOT NULL
);

-- holds all the conventions info--
CREATE TABLE "Convention"
(
  "ConventionID" SERIAL PRIMARY KEY,
  "OrganizationID" INTEGER
    REFERENCES "Organization"("OrganizationID"),
  "ConventionName" VARCHAR(255) NOT NULL,
  "ConventionStartTime" TIMESTAMP NOT NULL,
  "ConventionEndTime" TIMESTAMP NOT NULL,
  "ConventionNews" VARCHAR(255)
);

-- holds all the badge type info--
CREATE TABLE "BadgeType"
(
	"BadgeTypeID" SERIAL PRIMARY KEY,
	"BadgeTypeDescription" VARCHAR(255) NOT NULL,
	"isAvailableForSelfRegistration" BOOLEAN NOT NULL
);

-- holds the order id probably connects to one of their existing database tables that hold important attendee info--
CREATE TABLE "Order"
(
	"OrderID" SERIAL PRIMARY KEY NOT NULL
);

--Attendees table holds all of these attendees info--
CREATE TABLE "Attendee"
(
  "AttendeeID" SERIAL PRIMARY KEY,
  "ConventionID" INTEGER NOT NULL
    REFERENCES "Convention"("ConventionID"),
  "LastName" VARCHAR(255) NOT NULL,
  "FirstName" VARCHAR(255) NOT NULL,
  "MiddleName" VARCHAR(255) NOT NULL,
  "AddressLineOne" VARCHAR(255) NOT NULL,
  "AddressLineTwo" VARCHAR(255),
  "City" VARCHAR(255) NOT NULL,
  "StateProvince" VARCHAR(255) NOT NULL,
  "PostalCode" VARCHAR(255) NOT NULL,
  "CountryID" VARCHAR(255) NOT NULL,
  "EmailAddress" VARCHAR(255) NOT NULL,
  "PhoneNumber" VARCHAR(255) NOT NULL,
  "DateOfBirth" DATE NOT NULL,
  "BadgeName" VARCHAR(255) NOT NULL,
  "RegistrationDate" TIMESTAMP NOT NULL,
  "CheckInDate" TIMESTAMP,
  "PaymentDate" TIMESTAMP,
  "BadgeTypeID" INTEGER NOT NULL
    REFERENCES "BadgeType"("BadgeTypeID"),
  "BadgeNumber" VARCHAR(255) UNIQUE NOT NULL,
  "printed" BOOLEAN NOT NULL,
  "DiscordVerified" BOOLEAN NOT NULL,
  "PreRegSortNumber" INTEGER,
  "orderID" INTEGER
    REFERENCES "Order"("OrderID"),
  "FlaggedNoVolunteer" BOOLEAN DEFAULT false,
  "VolunteerID" INTEGER
);

-- holds all the location information -- 
CREATE TABLE "Location"
(
	"LocationID" SERIAL PRIMARY KEY,
	"LocationName" VARCHAR (255) NOT NULL,
	"LocationDescription" VARCHAR(255) NOT NULL,
	"LocationIsActive" BOOLEAN NOT NULL
);

-- holds all sponsor information-- 
CREATE TABLE "Sponsor"
(
	"SponsorID" SERIAL PRIMARY KEY,
	"SponsorName" VARCHAR(255) NOT NULL,
	"AmountPaid" VARCHAR(255) NOT NULL,
	"Website" VARCHAR(255) NOT NULL,
	"Notes" VARCHAR(255),
	"SponsorIsActive" BOOLEAN NOT NULL
);

-- holds all the events information--
CREATE TABLE "Event"
(
  "EventID" SERIAL PRIMARY KEY,
  "ConventionID" INTEGER NOT NULL
     REFERENCES "Convention"("ConventionID"),
  "EventName" VARCHAR(255) NOT NULL,
  "EventStartTime" TIMESTAMP WITH TIME ZONE NOT NULL,
  "EventEndTime" TIMESTAMP WITH TIME ZONE NOT NULL,
  "LocationID" INTEGER NOT NULL
    REFERENCES "Location"("LocationID"),
  "IsCancelled" BOOLEAN NOT NULL,
  "EventDescription" VARCHAR(255) NOT NULL,
  "SponsorID" INTEGER
    REFERENCES "Sponsor"("SponsorID"),
  "DateCreated" TIMESTAMP WITH TIME ZONE NOT NULL,
  "DateLastModified" TIMESTAMP WITH TIME ZONE,
  "EventModifiedNotes" VARCHAR(255)
);

-- holds all the tags information -- 
CREATE TABLE "Tags"
(
	"TagID" SERIAL PRIMARY KEY,
	"TagName" VARCHAR(255) NOT NULL,
	"TagIsActive" boolean DEFAULT true
);

-- a join table between events and tags -- 
CREATE TABLE "EventTags"
(
	"EventTagsID" SERIAL PRIMARY KEY,
	"Event_ID" INTEGER NOT NULL
    REFERENCES "Event"("EventID"),
	"Tag_ID" INTEGER NOT NULL
    REFERENCES "Tags"("TagID")
);

-- joins sponsor and convention tables --
CREATE TABLE "ConventionSponsor"
(
	"ConventionSponsorID" SERIAL PRIMARY KEY,
	"Convention_ID" INTEGER NOT NULL
    REFERENCES "Convention"("ConventionID"),
	"SponsorID" INTEGER NOT NULL
    REFERENCES "Sponsor"("SponsorID")
);

-- holds information about departments
CREATE TABLE "Department"
(
  "DepartmentID" SERIAL PRIMARY KEY,
  "DepartmentName" VARCHAR(255) NOT NULL UNIQUE,
  "DepartmentDescription" VARCHAR(255),
  "LocationID" integer
    REFERENCES "Location"("LocationID"),
  "ContactPersonBadge" VARCHAR(255)
    REFERENCES "Attendee"("BadgeNumber")
);

-- holds information about volunteers
CREATE TABLE "VolunteerContact" (
  "VolunteerID" SERIAL PRIMARY KEY,
  "VolunteerName" VARCHAR(255) NOT NULL UNIQUE,
  "VolunteerDiscord" VARCHAR(255),
  "VolunteerEmail" VARCHAR(255) NOT NULL,
  "VolunteerPhone" VARCHAR(255) NOT NULL,
  "MainDepartmentID" integer
    REFERENCES "Department"("DepartmentID"),
  "SecondaryDepartmentID" integer
    REFERENCES "Department"("DepartmentID"),
  "VolunteerNotes" text,
  "VolunteerHours" integer,
  "VolunteerShirtSize" VARCHAR(255),
  "VolunteerVetted" boolean default false
);
-- attaches VolunteerContact records to Attendee table, where appropriate
ALTER TABLE "Attendee"
  ADD CONSTRAINT "Attendee_fk_VolunteerID"
  FOREIGN KEY ("VolunteerID") REFERENCES "VolunteerContact"("VolunteerID");

-- holds information about volunteer roles
CREATE TABLE "Role"
(
  "RoleID" SERIAL PRIMARY KEY,
  "DepartmentID" integer NOT NULL
    REFERENCES "Department"("DepartmentID")
    ON DELETE CASCADE,
  "RoleName" VARCHAR(255) NOT NULL,
  "RoleDescription" VARCHAR(255),
  "RoleForWalkUps" boolean NOT NULL DEFAULT false,
  "RoleAdminNotes" VARCHAR(255)
);

-- holds details about volunteer shifts and the attendees filling them (if any) --
CREATE TABLE "Shift"
(
  "ShiftID" SERIAL PRIMARY KEY,
  "ShiftDate" date NOT NULL,
  "ShiftTime" time NOT NULL,
  "RoleID" integer NOT NULL
    REFERENCES "Role"("RoleID")
    ON DELETE CASCADE,
  "NoShow" boolean NOT NULL DEFAULT false,
  "BadgeNumber" VARCHAR(255)
    REFERENCES "Attendee"("BadgeNumber")
);


-- ** FOR THESE EXAMPLES TO WORK, SERIAL IDS MUST START FROM 1, YOU MIGHT NEED TO CHANGE AFTER YOU INSERT **--

--CONVENTIONS--
INSERT INTO "Convention"
  ("ConventionName", "ConventionStartTime", "ConventionEndTime", "ConventionNews")
VALUES
  ('2dCon.20 the 2D-Reconening', '8/20/2018', '08/25/2018', 'Pizza Party in the lobby nerds.  Come get some'),
  ('2dCon 2019: The weird gets weirder', '8/20/2019', '8/25/2019', 'Probably going to have to update these at some point!'),
  ('2dCon 2020: Remaster' , '8/20/2020', '8/25/2020', 'THE FUTURE WAS NOW');

--BADGE TYPES--
INSERT INTO "BadgeType"
  ("BadgeTypeDescription", "isAvailableForSelfRegistration")
VALUES
  ('21 plus', true),
  ('under 21', true),
  ('VIP', false);

--ORDERS--
INSERT INTO "Order"
  ("OrderID")
VALUES
  (1),
  (2),
  (3),
  (4);

--Walk-in Attendee who has checked in--
INSERT INTO "Attendee"
  ("ConventionID", "LastName", "FirstName", "MiddleName", "AddressLineOne", "AddressLineTwo", "City", "StateProvince", "PostalCode", "CountryID", "EmailAddress", "PhoneNumber", "DateOfBirth", "BadgeName", "RegistrationDate", "CheckInDate", "PaymentDate", "BadgeTypeID", "BadgeNumber", "printed", "DiscordVerified", "PreRegSortNumber", "orderID")
VALUES
  (3, 'OBannon', 'Chris', 'Ryan', '123 fakestreet', 'apartment 2', 'Savage', 'MN', '55378', 'United States', 'crobwan@gmail.com', '612-750-6236', '04/21/1990', 'pantspoopers', '08/23/2018', '08/23/2018', '08/23/2018', 2, '0001', false, false, '2', null),
  (3, 'Decalan', 'Berniedividisde', 'patrick', '789 dummdatalane', 'here', 'townmane', 'Quebec', '55676', 'Canada eh', 'declanB@gmail.com', '555-555-5555', '04/19/1999', 'mapleleaf', '08/22/2020', '08/22/2020', '08/22/2020', 2, '0002', true, true, 4, null);

--Walkinin Attendee who has not checked in--
INSERT INTO "Attendee"
  ("ConventionID", "LastName", "FirstName", "MiddleName", "AddressLineOne", "AddressLineTwo", "City", "StateProvince", "PostalCode", "CountryID", "EmailAddress", "PhoneNumber", "DateOfBirth", "BadgeName", "RegistrationDate", "BadgeTypeID", "BadgeNumber", "printed", "DiscordVerified", "PreRegSortNumber", "orderID")
VALUES
  (3, 'Marit', 'Zelinsky', '??', '123 fakestreet', 'apartment 2', 'Tonka', 'MN', '55345', 'United States', 'Zlinksy@gmail.com', '612-555-5555', '06/21/1992', 'hockey is cool', '08/23/2020', 1, '0003', false, false, '5', null);

--pregistered attendees who have not yet checked in--
INSERT INTO "Attendee"
  ("ConventionID", "LastName", "FirstName", "MiddleName", "AddressLineOne", "AddressLineTwo", "City", "StateProvince", "PostalCode", "CountryID", "EmailAddress", "PhoneNumber", "DateOfBirth", "BadgeName", "RegistrationDate", "PaymentDate", "BadgeTypeID", "BadgeNumber", "printed", "DiscordVerified", "PreRegSortNumber", "orderID")
VALUES
  (3, 'OBannnon', 'Chris', 'Ryan', '123 fakestreet', 'apartment 2', 'Savage', 'MN', '55378', 'United States', 'crobwan@gmail.com', '612-750-6236', '04/21/1990', 'pottytrained', '08/22/2019', '08/22/2019', 1, '0004', true, true, '3', '1'),
  (3, 'Smith', 'Alex', 'Smitty', '456 notreal lane', 'apartment 2', 'Minnetonka', 'MN', '55345', 'UNITED STATES', 'rodrigo321$gmail.com', '555-555-555', '10/13/1991', 'pottytrained', '08/22/2019', '08/22/2019', 1, '0005', true, true, '3', '1'),
  (3, 'Dustin', 'Fedie', 'guy', '4545 notrealave', 'basmenet', 'Saint Paul', 'MN', '55401', 'United STates', 'dustinisgreat@gamil.com', '555-555-55555', '11/22/1986', 'verysmart', '06/19/2020', '06/19/2020', 1, '0006', true, true, '3', '2');

--VOLUNTEER--
INSERT INTO "VolunteerContact"
  ("VolunteerName", "VolunteerDiscord", "VolunteerEmail", "VolunteerPhone", "VolunteerHours")
VALUES
  ('Dane Smith', 'primestuff', 'DainBSmith@gmail.com', '555-555-5555', 10);

--preregistered attendees who have checked in--
INSERT INTO "Attendee"
  ("ConventionID", "LastName", "FirstName", "MiddleName", "AddressLineOne", "AddressLineTwo", "City", "StateProvince", "PostalCode", "CountryID", "EmailAddress", "PhoneNumber", "DateOfBirth", "BadgeName", "RegistrationDate", "CheckInDate", "PaymentDate", "BadgeTypeID", "BadgeNumber", "printed", "DiscordVerified", "PreRegSortNumber", "orderID", "VolunteerID")
VALUES
  (3, 'Dubois', 'Andrew', 'Jamal', '123 fakestreet', 'apartment 2', 'Savage', 'MN', '55378', 'United States', 'doobers@gmail.com', '612-555-5555', '09/30/1989', 'dorkstuff', '04/23/2020', '08/23/2020', '04/23/2020', 1, '0007', true, false, '7', '1', null),
  (3, 'Dane', 'Smith', 'Donald', '2020 pretendplace', 'apt 3', 'NorthEast', 'MN', '55403', 'United States', 'DainBSmith@gmail.com', '555-555-5555', '05/05/1984', 'primestuff', '06/01/2020', '08/20/202', '06/01/2020', 1, '0008', true, true, '8', '3', 1);

--LOCATIONS--
INSERT INTO "Location"
  ("LocationName", "LocationDescription", "LocationIsActive")
VALUES
  ('Panel Room', 'Lakeshore B', false),
  ('Kids Corner', 'Regency Ballroom', false),
  ('Tabletop', 'Exhibition Hall', false),
  ('Arcade', 'Exhibition Hall', false),
  ('Console State', 'Greenway Ballroom', false),
  ('LAN Area', 'Exhibition Hall', false),
  ('Main Stage', 'Main Stage', false),
  ('Tournament Room', 'Lakeshore A', false);

--TAGS--
INSERT INTO "Tags"
  ("TagName")
VALUES
  ('Fan Run'),
  ('Panel'),
  ('Guests'),
  ('Family Friendly'),
  ('PS4');

--SPONSORS--
INSERT INTO "Sponsor"
  ("SponsorName", "AmountPaid", "Website", "SponsorIsActive")
VALUES
  ('Level Up Games', '2,000', 'https://www.levelupgamesmn.com/', false),
  ('Highlander Games', '5,000', 'http://highlandergamesmn.com/', false),
  ('Paradise Arcade Shop', '3,000', 'https://paradisearcadeshop.com', false),
  ('Anime Twin Cities', '4,000', 'https://www.animetwincities.org/', false),
  ('Discord', '20,000', 'https://discordapp.com/', false),
  ('Twitch', '30,000', 'https://www.twitch.tv/2dcon', false);

--SPONSORS W/ NOTES
INSERT INTO "Sponsor"
  ("SponsorName", "AmountPaid", "Website", "Notes", "SponsorIsActive")
VALUES
  ('Up Down Minneapolis', '6,000', 'https://www.updownarcadebar.com/minneapolis/', 'donating an arcade game this year!', false);

--EVENTS--
INSERT INTO "Event"
  ("ConventionID", "EventName", "EventStartTime", "EventEndTime", "LocationID", "IsCancelled", "EventDescription", "DateCreated")
VALUES
  ('1', 'Gamer Yoga', '08/23/2018 1:00 PM', '08/23/2018 2:00 PM', '2', 'FALSE', 'Want to level up your body at the same time you level up your game? Join us at the kids corner (all ages welcome) and bring your favorite gaming controller or handheld gaming device to experience gaming in the here and now.', '08/22/2018'),
  ('2', 'Century: Spice Road Trip Tournament', '08/25/2019 2:00 PM', '08/25/2019 6:00 PM', '3', 'FALSE', 'Century: Spice Road is the first in a series of games that explores the history of each century with spice-trading as the theme for the first installment.', '08/03/2019'),
  ('3', 'Tekken 7', '08/26/2020 1:00 PM', '08/26/2020 6:00 PM', '8', 'FALSE', 'Tekken 7!', '07/27/2020');

--SPONSORED EVENTS--
INSERT INTO "Event"
  ("ConventionID", "EventName", "EventStartTime", "EventEndTime", "LocationID", "IsCancelled", "EventDescription", "SponsorID", "DateCreated")
VALUES
  ('3', 'Counterstrike: GO', '08/26/2020 2:00 PM', '08/26/2020 6:00 PM', '6', 'FALSE', 'GO!', '6', '05/20/2020');

--CONVENTIONS SPONSOR JUNCTION TABLE--
INSERT INTO "ConventionSponsor"
  ("Convention_ID", "SponsorID")
VALUES
  ('1', '2'),
  ('2', '3'),
  ('3', '4'),
  ('3', '5'),
  ('3', '6'),
  ('3', '7');

--CANCELLED EVENTS--
INSERT INTO "Event"
  ("ConventionID", "EventName", "EventStartTime", "EventEndTime", "LocationID", "IsCancelled", "EventDescription", "DateCreated")
VALUES
  ('3', 'Marvel Vs. Capcom 2', '08/24/2020 2:00 PM', '08/24/2020 5:00 PM', '4', 'TRUE', 'wow!', '08/22/2020');

--MODIFIED EVENTS--
INSERT INTO "Event"
  ("ConventionID", "EventName", "EventStartTime", "EventEndTime", "LocationID", "IsCancelled", "EventDescription", "DateCreated", "DateLastModified", "EventModifiedNotes")
VALUES
  ('3', 'Dragon Ball FighterZ', '08/24/2020 2:00 PM', '08/24/2020 5:00 PM', '4', 'FALSE', 'haha!', '08/22/2020', '08/23/2020', 'please ensure all our guest keep it in under control');

--EVENT TAGS--
INSERT INTO "EventTags"
  ("Event_ID", "Tag_ID")
VALUES
  ('1', '4'),
  ('2', '5'),
  ('1', '1'),
  ('4', '1');
