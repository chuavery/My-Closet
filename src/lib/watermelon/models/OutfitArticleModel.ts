import { Model } from "@nozbe/watermelondb";
import { field, relation } from "@nozbe/watermelondb/decorators";

export class OutfitArticleModel extends Model {
    static table = "outfit_articles";

    static associations = {
        outfits: { type: "belongs_to" as const, key: "outfit_id" },
        articles: { type: "belongs_to" as const, key: "article_id" },
    };

    @relation("outfits", "outfit_id") outfit: any;
    @relation("articles", "article_id") article: any;
    @field("layer_type") layerType!: string;
    @field("z_index") zIndex!: number;
}
