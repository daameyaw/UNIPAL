export default {
  name: 'guides',
  title: 'Guides',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required().max(100),
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      validation: (Rule) => Rule.max(200),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Admissions', value: 'admissions'},
          {title: 'Academics', value: 'academics'},
          {title: 'Campus Navigation', value: 'navigation'},
          {title: 'Support Services', value: 'support'},
          {title: 'Campus Life', value: 'life'},
          {title: 'Program Requirements & Cut-off Points', value: 'programs'},
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'icon',
      title: 'Icon Name',
      type: 'string',
      options: {
        list: [
          {title: 'School Outline', value: 'school-outline'},
          {title: 'Card Outline', value: 'card-outline'},
          {title: 'Library Outline', value: 'library-outline'},
          {title: 'Book Outline', value: 'book-outline'},
          {title: 'Map Outline', value: 'map-outline'},
          {title: 'Help Buoy Outline', value: 'help-buoy-outline'},
          {title: 'Happy Outline', value: 'happy-outline'},
          {title: 'Create Outline', value: 'create-outline'},
          {title: 'Leaf Outline', value: 'leaf-outline'},
          {title: 'Checkmark Circle Outline', value: 'checkmark-circle-outline'},
          {title: 'Home Outline', value: 'home-outline'},
        ],
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'content',
      title: 'Content Blocks',
      type: 'array',
      of: [
        // Regular text block
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
          ],
          lists: [{title: 'Bullet', value: 'bullet'}],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
            ],
          },
        },
        // Step Block (for step-by-step guides)
        {
          name: 'stepBlock',
          title: 'Step Block',
          type: 'object',
          fields: [
            {name: 'emoji', title: 'Emoji', type: 'string'},
            {
              name: 'stepTitle',
              title: 'Step Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {name: 'description', title: 'Description', type: 'text'},
            {name: 'points', title: 'Bullet Points', type: 'array', of: [{type: 'string'}]},
            {name: 'linkText', title: 'Link Text', type: 'string'},
            {name: 'linkUrl', title: 'Link URL', type: 'string'},
          ],
          preview: {
            select: {title: 'stepTitle', subtitle: 'emoji'},
            prepare({title, subtitle}) {
              return {title: `${subtitle || '📝'} ${title}`}
            },
          },
        },
        // Points List Block (just bullet points, no step number)
        {
          name: 'pointsBlock',
          title: 'Points List Block',
          type: 'object',
          fields: [
            {name: 'emoji', title: 'Emoji (optional)', type: 'string'},
            {name: 'heading', title: 'Heading (optional)', type: 'string'},
            {name: 'description', title: 'Description (optional)', type: 'text'},
            {
              name: 'points',
              title: 'Points',
              type: 'array',
              of: [{type: 'string'}],
              validation: (Rule) => Rule.required().min(1),
            },
          ],
          preview: {
            select: {title: 'heading', subtitle: 'points'},
            prepare({title, subtitle}) {
              return {
                title: title || 'Points List',
                subtitle: `${subtitle?.length || 0} points`,
              }
            },
          },
        },
        // Simple Text Block (for paragraphs without formatting)
        {
          name: 'textBlock',
          title: 'Text Block',
          type: 'object',
          fields: [
            {name: 'heading', title: 'Heading (optional)', type: 'string'},
            {
              name: 'content',
              title: 'Content',
              type: 'text',
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {title: 'heading', subtitle: 'content'},
            prepare({title, subtitle}) {
              return {
                title: title || 'Text Block',
                subtitle: subtitle?.substring(0, 50) + '...',
              }
            },
          },
        },
        // Tip/Callout Block
        {
          name: 'tipBlock',
          title: 'Tip/Callout Block',
          type: 'object',
          fields: [
            {name: 'emoji', title: 'Emoji', type: 'string'},
            {name: 'tipTitle', title: 'Tip Title', type: 'string'},
            {
              name: 'tipContent',
              title: 'Tip Content',
              type: 'text',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'tipType',
              title: 'Tip Type',
              type: 'string',
              options: {
                list: [
                  {title: 'Info', value: 'info'},
                  {title: 'Warning', value: 'warning'},
                  {title: 'Success', value: 'success'},
                  {title: 'Pro Tip', value: 'tip'},
                ],
              },
            },
          ],
          preview: {
            select: {title: 'tipTitle', subtitle: 'tipType'},
          },
        },
        // Link Block
        {
          name: 'linkBlock',
          title: 'Link Block',
          type: 'object',
          fields: [
            {
              name: 'linkText',
              title: 'Link Text',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {name: 'linkUrl', title: 'Link URL or Screen Name', type: 'string'},
            {name: 'icon', title: 'Icon (optional)', type: 'string'},
          ],
          preview: {
            select: {title: 'linkText'},
          },
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
    },
  },
}
