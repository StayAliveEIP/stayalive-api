import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Link } from '../../../../database/link.schema';

@Injectable()
export class LinkService {
  constructor(@InjectModel(Link.name) private linkModel: Model<Link>) {}

  async createLink(link: string, expiration: Date | null) {
    const newLink: Link = {
      _id: new Types.ObjectId(),
      url: link,
      createdAt: new Date(),
      expiresAt: expiration,
    };
    await this.linkModel.create(newLink);
    return {
      message: 'Le lien a bien été créé.',
    };
  }

  async deleteLink(id: string) {
    if (!this.linkModel.findById(id)) {
      throw new HttpException('Link not found', 404);
    }
    await this.linkModel.findByIdAndDelete(id);
    return {
      message: 'Le lien a bien été supprimé.',
    };
  }

  async getLink(id: string) {
    const link: Link = await this.linkModel.findById(new Types.ObjectId(id));
    console.log(link);
    if (!link) {
      throw new HttpException('Link not found', 404);
    }
    return link;
  }

  async redirectLink(id: string, res) {
    const link = await this.getLink(id);
    if (link.expiresAt && link.expiresAt < new Date()) {
      throw new HttpException('Link expired', 410);
    }
    res.redirect(link.url);
  }
}
