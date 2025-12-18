# import tensorflow as tf
# import os
# import numpy as np
# import matplotlib.pyplot as plt
# import seaborn as sns
# from tensorflow.keras import layers, models, optimizers
# from tensorflow.keras.applications import EfficientNetB0
# from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau, ModelCheckpoint
# from sklearn.metrics import classification_report, confusion_matrix
#
# # --- CONFIG ---
# DATA_DIR = '/kaggle/input/breast-ultrasound-images-dataset/Dataset_BUSI_with_GT'
# BATCH_SIZE = 16
# IMG_SIZE = (224, 224)
# SEED = 123 # Changed seed to shake things up
#
# print("========================================")
# print("   NUCLEAR OPTION: EfficientNetB0")
# print("========================================")
#
# # --- 1. DATA LOADING ---
# print("\n1. Loading Data...")
# list_ds = tf.data.Dataset.list_files(f"{DATA_DIR}/*/*.png", shuffle=True, seed=SEED)
# clean_ds = list_ds.filter(lambda x: not tf.strings.regex_full_match(x, ".*_mask.png"))
# all_files = list(clean_ds)
# total_images = len(all_files)
# print(f"   Found {total_images} clean images.")
#
# train_end = int(total_images * 0.7)
# val_end = train_end + int(total_images * 0.15)
# train_files = all_files[:train_end]
# val_files = all_files[train_end:val_end]
# test_files = all_files[val_end:]
#
# # Pipeline
# def process_path(file_path):
#     img = tf.io.read_file(file_path)
#     img = tf.image.decode_png(img, channels=3)
#     img = tf.image.resize(img, IMG_SIZE) 
#     # EfficientNet expects 0-255 inputs, not 0-1! It handles normalization internally.
#     
#     parts = tf.strings.split(file_path, os.path.sep)
#     label_text = parts[-2]
#     
#     label = -1
#     if label_text == 'benign': label = 0
#     elif label_text == 'malignant': label = 1
#     elif label_text == 'normal': label = 2
#     return img, label
#
# train_ds = tf.data.Dataset.from_tensor_slices(train_files).map(process_path).batch(BATCH_SIZE).prefetch(tf.data.AUTOTUNE)
# val_ds = tf.data.Dataset.from_tensor_slices(val_files).map(process_path).batch(BATCH_SIZE).prefetch(tf.data.AUTOTUNE)
# test_ds = tf.data.Dataset.from_tensor_slices(test_files).map(process_path).batch(BATCH_SIZE).prefetch(tf.data.AUTOTUNE)
#
# # --- 2. MODEL BUILDING (EfficientNetB0) ---
# print("\n2. Building EfficientNetB0 Model...")
#
# base_model = EfficientNetB0(input_shape=(224, 224, 3), include_top=False, weights='imagenet')
# base_model.trainable = True # We will train it ALL from the start (unfrozen)
#
# inputs = layers.Input(shape=(224, 224, 3))
# x = layers.RandomFlip("horizontal_and_vertical")(inputs)
# x = layers.RandomRotation(0.2)(x)
# x = layers.RandomContrast(0.2)(x)
#
# x = base_model(x, training=True)
# x = layers.GlobalAveragePooling2D()(x)
# x = layers.Dropout(0.5)(x)
# outputs = layers.Dense(3, activation='softmax')(x)
#
# model = models.Model(inputs, outputs)
#
# # SGD often stabilizes training better than Adam on noisy medical data
# model.compile(optimizer=optimizers.SGD(learning_rate=0.01, momentum=0.9), 
#               loss='sparse_categorical_crossentropy', 
#               metrics=['accuracy'])
#
# # --- 3. TRAINING ---
# print("\n3. Training (Full Unfreeze from Start)...")
# history = model.fit(
#     train_ds, validation_data=val_ds, epochs=30,
#     callbacks=[
#         ModelCheckpoint('best_wehshi_model.h5', save_best_only=True, monitor='val_accuracy', mode='max'),
#         EarlyStopping(patience=8, restore_best_weights=True),
#         ReduceLROnPlateau(factor=0.5, patience=3)
#     ],
#     verbose=1
# )
#
# # --- 4. EVALUATION ---
# print("\n4. Final Evaluation...")
# y_true = []
# y_pred = []
#
# for img, label in test_ds:
#     pred = model.predict(img, verbose=0)
#     y_true.extend(label.numpy())
#     y_pred.extend(np.argmax(pred, axis=1))
#
# acc = np.mean(np.array(y_true) == np.array(y_pred))
# print(f"\nFINAL TEST ACCURACY: {acc * 100:.2f}%")
#
# print("\n--- Classification Report ---")
# print(classification_report(y_true, y_pred, target_names=['Benign', 'Malignant', 'Normal']))
#
# print("\n--- Confusion Matrix ---")
# cm = confusion_matrix(y_true, y_pred)
# plt.figure(figsize=(6,5))
# sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=['Benign', 'Malignant', 'Normal'], yticklabels=['Benign', 'Malignant', 'Normal'])
# plt.ylabel('Actual')
# plt.xlabel('Predicted')
# plt.title('Confusion Matrix')
# plt.show()
#
#
#
# # =====================================================
#
#
#
# # import shutil
# # import os
# # import matplotlib.pyplot as plt
# # import numpy as np
#
# # print("Preparing downloads...")
#
# # # 1. ZIP THE TEST IMAGES
# # # We need to save the test images to a folder first
# # if os.path.exists('manual_test_images'): shutil.rmtree('manual_test_images')
# # os.makedirs('manual_test_images')
#
# # print("Saving test images to folder...")
# # class_names = ['benign', 'malignant', 'normal']
# # count = 0
#
# # # Check if 'test_ds' exists (from your training run)
# # if 'test_ds' in globals():
# #     for img, label in test_ds:
# #         # EfficientNet uses 0-255, so we convert to uint8 for saving
# #         img_np = img.numpy().astype("uint8") 
# #         lbl_np = label.numpy()
#         
# #         for i in range(len(img_np)):
# #             # Get class name
# #             name = class_names[lbl_np[i]]
# #             # Save file: benign_0.png, malignant_1.png, etc.
# #             plt.imsave(f"manual_test_images/{name}_{count}.png", img_np[i])
# #             count += 1
#     
# #     # Create the Zip File
# #     shutil.make_archive('test_images_archive', 'zip', 'manual_test_images')
# #     print(f"-> Created 'test_images_archive.zip' with {count} images.")
# # else:
# #     print("WARNING: 'test_ds' not found. Did you run the training script?")
#
# # # 2. CHECK FOR MODEL FILE
# # model_filename = 'best_wehshi_model.h5'
# # if os.path.exists(model_filename):
# #     print(f"-> Found model file: {model_filename}")
# # else:
# #     # If the file isn't there, try to save the current model from memory
# #     if 'model' in globals():
# #         print(f"-> Saving model from memory to {model_filename}...")
# #         model.save(model_filename)
# #     else:
# #         print("ERROR: No model found in memory or on disk!")
#
# # print("\n=======================================================")
# # print("DOWNLOAD INSTRUCTIONS:")
# # print("1. Look at the 'Output' tab in the Right Sidebar.")
# # print(f"2. Download '{model_filename}'")
# # print("3. Download 'test_images_archive.zip'")
# # print("=======================================================")
