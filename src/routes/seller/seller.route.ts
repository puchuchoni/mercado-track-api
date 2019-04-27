import { Router, Response, Request } from 'express';
import { Seller } from './../../models';

export const sellerRouter = Router();

// TODO: add get all sellers with pagination
sellerRouter.route('/:id')
  .get(getSellerById);

async function getSellerById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const [seller] = await Seller.find({ id });
    if (seller) res.json(seller);
    else res.send(404);
  } catch (error) {
    res.status(500).send({ error });
  }
}
