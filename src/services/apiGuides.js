import client from "../../sanity";

/**
 * Guides API service
 *
 * Provides typed fetch helpers for retrieving guide content from Sanity.
 * Two entry points:
 * - getGuidesByCategory(category): ordered list of guides for a category
 * - getGuideById(id): single guide by id (supports drafts and published)
 */

// Query: fetch all guides for a category, ordered by rankNumber asc
const query = `
*[_type == "guides" && category == $category] | order(rankNumber asc) {
  _id,
  title,
  subtitle,
  category,
  icon,
  rankNumber,
  content[] {
    _type,
    _key,
    
    // For stepBlock
    _type == "stepBlock" => {
      emoji,
      stepTitle,
      description,
      points,
      linkText,
      linkUrl
    },
    
    // For pointsBlock
    _type == "pointsBlock" => {
      emoji,
      heading,
      description,
      points
    },
    
    // For textBlock
    _type == "textBlock" => {
      heading,
      content
    },
    
    // For tipBlock
    _type == "tipBlock" => {
      emoji,
      tipTitle,
      tipContent,
      tipType
    },
    
    // For linkBlock
    _type == "linkBlock" => {
      linkTitle,
      linkText,
      linkUrl,
      emoji
    },
    
    // For imageBlock
    _type == "imageBlock" => {
      image{
        asset->{
          url
        }
      },
      alt,
      caption
    },
    
    // For cutOffBlock
    _type == "cutOffBlock" => {
      heading,
      description,
      cutOffs[] {
        program,
        grade
      }
    },
    // For locationLinkBlock
    _type == "locationLinkBlock" => {
      locationName,
      locationDescription,
      locationId,
      openingTimes,
      distance,
      code,
      title
    },
    
    // For regular portable text blocks
    _type == "block" => {
      style,
      children[] {
        text,
        marks
      }
    }
  }
}
`;

// Query: fetch all guides regardless of category, ordered by rankNumber asc
const queryAll = `
*[_type == "guides"] | order(rankNumber asc) {
  _id,
  title,
  subtitle,
  category,
  icon,
  rankNumber,
  content[] {
    _type,
    _key,
    
    // For stepBlock
    _type == "stepBlock" => {
      emoji,
      stepTitle,
      description,
      points,
      linkText,
      linkUrl
    },
    
    // For pointsBlock
    _type == "pointsBlock" => {
      emoji,
      heading,
      description,
      points
    },
    
    // For textBlock
    _type == "textBlock" => {
      heading,
      content
    },
    
    // For tipBlock
    _type == "tipBlock" => {
      emoji,
      tipTitle,
      tipContent,
      tipType
    },
    
    // For linkBlock
    _type == "linkBlock" => {
      linkTitle,
      linkText,
      linkUrl,
      emoji
    },
    
    // For imageBlock
    _type == "imageBlock" => {
      image{
        asset->{
          url
        }
      },
      alt,
      caption
    },
    
    // For cutOffBlock
    _type == "cutOffBlock" => {
      heading,
      description,
      cutOffs[] {
        program,
        grade
      }
    },
    // For locationLinkBlock
    _type == "locationLinkBlock" => {
      locationName,
      locationDescription,
      locationId,
      openingTimes,
      distance,
      code,
      title
    },
    
    // For regular portable text blocks
    _type == "block" => {
      style,
      children[] {
        text,
        marks
      }
    }
  }
}
`;

/**
 * getGuidesByCategory
 * @param {string} category - Category slug/name to filter guides (e.g., "Admissions")
 * @returns {Promise<Array>} A list of guide objects ordered by rankNumber.
 */
export async function getGuidesByCategory(category) {
  return await client.fetch(query, { category }, { cache: "no-store" });
}

/**
 * getAllGuides
 * @returns {Promise<Array>} A list of all guide objects ordered by rankNumber.
 */
export async function getAllGuides() {
  return await client.fetch(queryAll, {}, { cache: "no-store" });
}

// Query: fetch a single guide by id. Supports preview of drafts by checking both ids
const queryById = `
*[_id in ["drafts." + $id, $id]] | order(_updatedAt desc)[0] {
  _id,
  title,
  subtitle,
  category,
  icon,
  rankNumber,
  content[] {
    _type,
    _key,
    
    // For stepBlock
    _type == "stepBlock" => {
      emoji,
      stepTitle,
      description,
      points,
      linkText,
      linkUrl
    },
    
    // For pointsBlock
    _type == "pointsBlock" => {
      emoji,
      heading,
      description,
      points
    },
    
    // For textBlock
    _type == "textBlock" => {
      heading,
      content
    },
    
    // For tipBlock
    _type == "tipBlock" => {
      emoji,
      tipTitle,
      tipContent,
      tipType
    },
    
    // For linkBlock
    _type == "linkBlock" => {
      linkTitle,
      linkText,
      linkUrl,
      emoji
    },
    
    // For imageBlock
    _type == "imageBlock" => {
      image{
        asset->{
          url
        }
      },
      alt,
      caption
    },
    
    // For cutOffBlock
    _type == "cutOffBlock" => {
      heading,
      description,
      cutOffs[] {
        program,
        grade
      }
    },
        // For locationLinkBlock
    _type == "locationLinkBlock" => {
      locationName,
      locationDescription,
      locationId,
      openingTimes,
      distance,
      code,
      title
    },

    
    // For regular portable text blocks
    _type == "block" => {
      style,
      children[] {
        text,
        marks
      }
    }
  }
}
`;

/**
 * getGuideById
 * @param {string} id - Sanity document id. Accepts either published id or a "drafts." prefixed id.
 * @returns {Promise<Object|null>} Guide object or null if not found.
 */
export async function getGuideById(id) {
  // Normalize: accept ids with or without the 'drafts.' prefix
  const cleanId = id.replace("drafts.", "");
  return await client.fetch(queryById, { id: cleanId }, { cache: "no-store" });
}
