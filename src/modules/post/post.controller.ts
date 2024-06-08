import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Put,
  Query,
} from '@nestjs/common';
import { ApiAcceptedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { type PageDto } from '../../common/dto/page.dto';
import { RoleType } from '../../constants';
import { ApiPageOkResponse, Auth, UUIDParam } from '../../decorators';
import { PostPageOptionsDto } from './dtos/post-page-options.dto';
import { PostDto } from './dtos/post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { PostService } from './post.service';

@Controller('posts')
@ApiTags('posts')
export class PostController {
  constructor(private postService: PostService) {}
  @Get()
  @Auth([RoleType.USER])
  @ApiPageOkResponse({ type: PostDto })
  async getPosts(
    @Query() postsPageOptionsDto: PostPageOptionsDto,
  ): Promise<PageDto<PostDto>> {
    return this.postService.getAllPost(postsPageOptionsDto);
  }

  @Get(':id')
  @Auth([])
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: PostDto })
  async getSinglePost(@UUIDParam('id') id: Uuid): Promise<PostDto> {
    const entity = await this.postService.getSinglePost(id);

    return entity.toDto();
  }

  @Put(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse()
  updatePost(
    @UUIDParam('id') id: Uuid,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<void> {
    return this.postService.updatePost(id, updatePostDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiAcceptedResponse()
  async deletePost(@UUIDParam('id') id: Uuid): Promise<void> {
    await this.postService.deletePost(id);
  }
}
