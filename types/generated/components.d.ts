import type { Schema, Struct } from '@strapi/strapi';

export interface AllergenAllergen extends Struct.ComponentSchema {
  collectionName: 'components_allergen_allergens';
  info: {
    displayName: 'Allergen';
    icon: 'emotionUnhappy';
  };
  attributes: {
    Description: Schema.Attribute.Text;
    Icon: Schema.Attribute.Media<'images' | 'files'>;
    Name: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'allergen.allergen': AllergenAllergen;
    }
  }
}
