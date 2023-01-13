'use strict';

exports.up = function(db, callback) {
    db.runSql(
        `
        ALTER TABLE features DROP COLUMN "enabled";
        ALTER TABLE features ADD COLUMN "non_prod_enabled" BOOLEAN NOT NULL DEFAULT TRUE;
        ALTER TABLE features ADD COLUMN "prod_enabled" BOOLEAN NOT NULL DEFAULT FALSE;
    `,
        callback
    );
};

exports.down = function(db, callback) {
    db.runSql(
        `
    ALTER TABLE features DROP COLUMN "non_prod_enabled";
    ALTER TABLE features DROP COLUMN "prod_enabled";
    ALTER TABLE features ADD COLUMN "enabled" integer NOT NULL DEFAULT 0;
    `,
        callback
    );
};
