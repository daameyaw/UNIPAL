import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'academicEvent',
  title: 'Academic Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Event Title',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Event Description',
      type: 'text',
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'date',
    }),
    defineField({
      name: 'tag',
      title: 'Event Tag',
      type: 'string',
    }),
    defineField({
      name: 'iconName',
      title: 'Event Icon',
      type: 'string',
      description: 'Choose an Ionicons icon to represent this event visually',
      options: {
        list: [
          {title: 'Course Registration', value: 'school-outline'},
          {title: 'Biometric', value: 'finger-print-outline'},
          {title: 'Virtual Orientation', value: 'laptop-outline'},
          {title: 'Residential Orientation', value: 'home-outline'},
          {title: 'Academic Orientation', value: 'library-outline'},
          {title: 'Matriculation', value: 'ribbon-outline'},
          {title: 'Mid-Semester Examination', value: 'reader-outline'},
          {title: 'Close Circle', value: 'close-circle-outline'},
          {title: 'Megaphone', value: 'megaphone-outline'},
        ],
      },
    }),
  ],
})
