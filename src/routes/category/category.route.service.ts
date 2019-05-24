import { Category, Article } from '../../models';

export class CategoryRouteService {

  public static sampleSize = 4;

  public static async getCategoriesAggregated () {
    const categories = await Category.find({}, { __v: 0 }).lean();
    const aggregations = await Promise.all(
      categories.map((category) => {
        const children = categories.filter(child => child.parent === category._id).map(child => child._id);
        return this.getAggregation(category, children);
      }),
    );
    for (let i = 0; i < aggregations.length; i++) {
      Object.assign(categories[i], aggregations[i]);
    }
    return categories;
  }

  private static async getAggregation (category, children) {
    if (category.parent) {
      const articleCount = await Article.find({ category_id: category._id }).countDocuments();
      return { articleCount };
    }
    const samples = await Article.aggregate(this.samplesAggregation(children));
    return { samples };
  }

  private static samplesAggregation (children) {
    return [
      // matching articles
      {
        $match: {
          status: 'active',
          category_id: {
            $exists: true,
          },
          $expr: {
            $in: ['$category_id', children],
          },
        },
      },
      // taking 4 samples
      { $sample: { size: this.sampleSize } },
      // only need 1 image, taking the first one
      { $addFields: { image: { $arrayElemAt: ['$images', 0] } } },
      // removing unnecessary fields
      {
        $project : {
          _id : 0,
          __v: 0,
          currency_id: 0,
          thumbnail: 0,
          seller_id: 0,
          status: 0,
          images: 0,
          history: 0,
          permalink: 0,
        },
      },
    ];
  }

}
