import express from "express";
import multer from "multer";
// import { asyncWrapper } from "../common/utils/wrapper";
import authenticate from "../common/middlewares/authenticate";
import { canAccess } from "../common/middlewares/canAccess";
import { Roles } from "../common/constants";
// import { ProductController } from "./product-controller";
import createProductValidator from "./create-product-validator";
// import { ProductService } from "./product-service";
// import updateProductValidator from "./update-product-validator";
import fileUpload from "express-fileupload";
import createHttpError from "http-errors";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // uses buffer in req.file

// const productService = new ProductService();
// const productController = new ProductController(productService);

router.post(
    "/",
    authenticate,
    canAccess([Roles.ADMIN, Roles.MANAGER]),
    upload.single("file"), // 'file' is the field name in form-data
    createProductValidator,
    // asyncWrapper(productController.create),
);

router.put(
    "/:productId",
    authenticate,
    canAccess([Roles.ADMIN, Roles.MANAGER]),
    fileUpload({
        limits: { fileSize: 500 * 1024 }, // 500kb
        abortOnLimit: true,
        limitHandler: (_req, res, next) => {
            const error = createHttpError(400, "File size exceeds the limit");
            next(error);
        },
    }),
    // updateProductValidator,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    // asyncWrapper(productController.update),
);

export default router;
