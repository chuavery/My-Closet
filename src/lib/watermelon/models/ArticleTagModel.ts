import { Model } from "@nozbe/watermelondb";
import { relation } from "@nozbe/watermelondb/decorators";

export class ArticleTagModel extends Model {
    static table = "article_tags";

    static associations = {
        articles: { type: "belongs_to" as const, key: "article_id" },
        tags: { type: "belongs_to" as const, key: "tag_id" },
    };

    @relation("articles", "article_id") article: any;
    @relation("tags", "tag_id") tag: any;
}
