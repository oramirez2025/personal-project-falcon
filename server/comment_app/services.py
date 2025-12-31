from collections import defaultdict
from .models import Comment
from .serializers import CommentSerializer

# I am the Lorax. I speak for the trees 🌳
def build_comment_tree(event):
    """ Builds the tree structure of the comments for a given event """
    

    # grab all the comments
    comments = (
        Comment.objects
        .filter(event=event)
        .select_related("author")
        .order_by("time")
    )

    flat_comments = CommentSerializer(comments,many=True).data

    children = defaultdict(list)
    
    # Group by parent_id  
    for comment in flat_comments:
        children[comment["parent"]].append(comment)
    
    # Attach replies to comments
    for comment in flat_comments:
        comment["replies"] = children.get(comment["id"], [])
    
    # Return root comments 
    return children.get(None, []) # in case no comments exist yet