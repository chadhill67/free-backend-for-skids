const express = require("express");
const app = express();
const Profile = require("../models/Profile.js");

function mcpResponse(profileId, profile, changes) {
    return {
        profileRevision: profile.rvn,
        profileId: profileId,
        profileChangesBaseRevision: profile.rvn - 1,
        profileChanges: changes,
        profileCommandRevision: profile.commandRevision,
        serverTime: new Date().toISOString(),
        responseVersion: 1
    };
}

app.post("/fortnite/api/game/v2/profile/:accountId/client/:operation", async (req, res) => {
    const { accountId, operation } = req.params;
    const profileId = req.query.profileId || "athena";

    const doc = await Profile.findOne({ accountId });
    if (!doc || !doc.profiles[profileId]) {
        return res.status(404).send({ error: "Profile not found" });
    }

    const profile = doc.profiles[profileId];
    let changes = [];

    switch (operation) {
        case "QueryProfile": {
            changes.push({ changeType: "fullProfileUpdate", profile: profile });
            break;
        }

        case "MarkItemSeen": {
            const { itemIds } = req.body;
            (itemIds || []).forEach((id) => {
                if (profile.items[id]) {
                    profile.items[id].attributes.item_seen = true;
                    changes.push({
                        changeType: "itemAttrChanged",
                        itemId: id,
                        attributeName: "item_seen",
                        attributeValue: true
                    });
                }
            });
            break;
        }

        case "SetItemFavoriteStatusBatch": {
            const { itemIds, itemFavStatus } = req.body;
            (itemIds || []).forEach((id, i) => {
                if (profile.items[id]) {
                    const fav = itemFavStatus[i];
                    profile.items[id].attributes.favorite = fav;
                    changes.push({
                        changeType: "itemAttrChanged",
                        itemId: id,
                        attributeName: "favorite",
                        attributeValue: fav
                    });
                }
            });
            break;
        }

        case "EquipBattleRoyaleCustomization": {
            const { slotName, itemToSlot, indexWithinSlot } = req.body;

            const slotMap = {
                Character: "favorite_character",
                Backpack: "favorite_backpack",
                Pickaxe: "favorite_pickaxe",
                Glider: "favorite_glider",
                SkyDiveContrail: "favorite_skydivecontrail",
                MusicPack: "favorite_musicpack",
                LoadingScreen: "favorite_loadingscreen"
            };

            if (slotName === "Dance") {
                const arr = profile.stats.attributes.favorite_dance;
                arr[indexWithinSlot] = itemToSlot;
                changes.push({
                    changeType: "statModified",
                    name: "favorite_dance",
                    value: arr
                });
            } else if (slotName === "ItemWrap") {
                const arr = profile.stats.attributes.favorite_itemwraps;
                if (indexWithinSlot === -1) {
                    for (let i = 0; i < 7; i++) arr[i] = itemToSlot;
                } else {
                    arr[indexWithinSlot] = itemToSlot;
                }
                changes.push({
                    changeType: "statModified",
                    name: "favorite_itemwraps",
                    value: arr
                });
            } else if (slotMap[slotName]) {
                const attr = slotMap[slotName];
                profile.stats.attributes[attr] = itemToSlot;
                changes.push({
                    changeType: "statModified",
                    name: attr,
                    value: itemToSlot
                });
            }
            break;
        }

        case "SetMtxPlatform": {
            const { newPlatform } = req.body;
            profile.stats.attributes.current_mtx_platform = newPlatform || "EpicPC";
            changes.push({
                changeType: "statModified",
                name: "current_mtx_platform",
                value: profile.stats.attributes.current_mtx_platform
            });
            break;
        }

        default: {
            break;
        }
    }

    if (changes.length > 0 && operation !== "QueryProfile") {
        profile.rvn += 1;
        profile.commandRevision += 1;
        doc.markModified(`profiles.${profileId}`);
        await doc.save();
    }

    return res.status(200).send(mcpResponse(profileId, profile, changes));
});

module.exports = app;
