import {
  createFeedPost,
  deleteFeedPost,
  listFeedPosts,
  updateFeedPost,
} from "../services/feedPostService.js";
import { handleControllerError } from "../utils/permissions.js";

export async function getMyFeedPosts(req, res) {
  try {
    const rows = await listFeedPosts({
      authorId: req.user?.id,
      includeDrafts: true,
      status: "",
    });
    return res.json(rows);
  } catch (error) {
    return handleControllerError(res, error);
  }
}

export async function postFeedPost(req, res) {
  try {
    const row = await createFeedPost(req.user, req.body || {});
    return res.status(201).json(row);
  } catch (error) {
    return handleControllerError(res, error);
  }
}

export async function patchFeedPost(req, res) {
  try {
    const row = await updateFeedPost(
      req.user,
      req.params.postId,
      req.body || {},
    );
    return res.json(row);
  } catch (error) {
    return handleControllerError(res, error);
  }
}

export async function removeFeedPost(req, res) {
  try {
    await deleteFeedPost(req.user, req.params.postId);
    return res.json({ ok: true });
  } catch (error) {
    return handleControllerError(res, error);
  }
}
