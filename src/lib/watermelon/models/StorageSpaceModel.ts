import { Model } from "@nozbe/watermelondb";
import { field, children } from "@nozbe/watermelondb/decorators";

export class StorageSpaceModel extends Model {
    static table = "storage_spaces";

    static associations = {
        articles: { type: "has_many" as const, foreignKey: "storage_space_id" },
    };

    @field("name") name!: string;
    @field("sub_location") subLocation?: string;
    @field("qr_code_value") qrCodeValue!: string;
    @field("created_at") createdAt!: string;

    @children("articles") articles: any;
}
