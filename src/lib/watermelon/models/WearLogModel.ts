import { Model } from "@nozbe/watermelondb";
import { field, relation } from "@nozbe/watermelondb/decorators";

export class WearLogModel extends Model {
    static table = "wear_logs";

    static associations = {
        articles: { type: "belongs_to" as const, key: "article_id" },
        outfits: { type: "belongs_to" as const, key: "outfit_id" },
    };

    @relation("articles", "article_id") article: any;
    @relation("outfits", "outfit_id") outfit: any;
    @field("worn_date") wornDate!: string;
}
