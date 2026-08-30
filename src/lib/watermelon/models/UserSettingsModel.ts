import { Model } from "@nozbe/watermelondb";
import { field } from "@nozbe/watermelondb/decorators";

export class UserSettingsModel extends Model {
    static table = "user_settings";

    @field("wear_history_enabled") wearHistoryEnabled!: boolean;
    @field("theme_mode") themeMode!: string;
}
