import { SeedHomeConfigAdminReqDto } from '../dto/admin/home-config.admin.req.dto';
import { HomeSectionType } from '../enums/home-config.enum';

export const DEFAULT_HOME_CONFIG_DATA: SeedHomeConfigAdminReqDto = {
  sections: [
    {
      data: [
        {
          link: 'string',
          image: 'https://tinypng.com/images/social/website.jpg',
          imageId: 2,
          params: {},
        },
        {
          link: 'string',
          image:
            'https://static.vecteezy.com/packs/media/photos/term-bg-1-34fe4c59.jpg',
          imageId: 3,
          params: {},
        },
      ],
      type: HomeSectionType.BANNER,
    },
    {
      data: [
        {
          link: 'string',
          name: 'name',
          image:
            'https://static.vecteezy.com/packs/media/photos/term-bg-1-34fe4c59.jpg',
          imageId: 2,
          params: {},
        },
        {
          link: 'string',
          name: 'name',
          image:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDkvFCLSMbUU6Bqb1m-0y3LPAQ7_Gcs-PNZw&usqp=CAU',
          imageId: 2,
          params: {},
        },
        {
          link: 'string',
          name: 'name',
          image:
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTP6-MfoJ0MLH3ZH7oIyNvP_PfLRoYI-ZgPeQ&usqp=CAU',
          imageId: 2,
          params: {},
        },
      ],
      type: HomeSectionType.NORMAL_SERVICE,
      title: 'Services',
    },
  ],
};
