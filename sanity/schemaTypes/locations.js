export default {
  name: 'location',
  title: 'Location',
  type: 'document',
  fields: [
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Shuttle Stops', value: 'shuttle_stops'},
          {title: 'School Libraries', value: 'school_libraries'},
          {title: 'Colleges', value: 'colleges'},
          {title: 'Medical Centers', value: 'medical_centers'},
          {title: 'Biometric Centers', value: 'biometric_centers'},
          {title: 'Halls of Residences', value: 'halls_of_residences'},
          {title: 'Support Services', value: 'support_services'},
          {title: 'Food Joints', value: 'food_joints'},
          {title: 'Banks and ATMs', value: 'banks_atms'},
          {title: 'Printing Centers', value: 'printing_centers'},
        ],
      },
    },
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'hours',
      title: 'Opening Hours',
      type: 'string',
    },
    {
      name: 'latitude',
      title: 'Latitude',
      type: 'number',
    },
    {
      name: 'longitude',
      title: 'Longitude',
      type: 'number',
    },
    {
      name: 'additionalInfo',
      title: 'Additional Info',
      type: 'string',
    },
  ],
}
