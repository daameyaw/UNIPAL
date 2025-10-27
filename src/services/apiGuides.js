import client from "../../sanity";

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
      linkText,
      linkUrl,
      icon
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
export async function getGuidesByCategory(category) {
  return await client.fetch(query, { category }, { cache: "no-store" });
}


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
    
    // For cutOffBlock
    _type == "cutOffBlock" => {
      heading,
      description,
      cutOffs[] {
        program,
        grade
      }
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


export async function getGuideById(id) {
  // Remove 'drafts.' prefix if present
  const cleanId = id.replace("drafts.", "");
  return await client.fetch(queryById, { id: cleanId }, { cache: "no-store" });
}
