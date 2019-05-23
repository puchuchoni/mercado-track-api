import { Category, Article } from '../../models';

export class CategoryRouteService {

  public static sampleSize = 4;

  public static async getCategoriesAggregated () {
    const categories = await Category.find({}, { __v: 0 }).lean();
    const aggregations = await Promise.all(
      categories.map(CategoryRouteService.getAggregation),
    );
    for (let i = 0; i < aggregations.length; i++) {
      Object.assign(categories[i], aggregations[i]);
    }
    return categories;
  }

  private static async getAggregation (category) {
    const articleCount = await Article.estimatedDocumentCount({ category_id: category._id });
    if (category.parent) {
      return { articleCount };
    }
    const samples = await Article.aggregate(CategoryRouteService.samplesAggregation(category._id));
    return { articleCount, samples };
  }

  private static samplesAggregation (id) {
    return [
      // matching articles
      { $match: { category_id: id, status: 'active' } },
      // taking 4 samples
      { $sample: { size: CategoryRouteService.sampleSize } },
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
