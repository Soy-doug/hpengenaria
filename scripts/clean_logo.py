from PIL import Image
import numpy as np

print('Starting high-precision logo segmentation & defringing...')
# Load the raw isnet segmentation
img = Image.open('assets/test_isnet.png')
arr = np.array(img, dtype=float)

rgb = arr[:, :, :3]
alpha = arr[:, :, 3] / 255.0

arr_clean_alpha = alpha.copy()

# 1. Clear stray left shadow patch (x < 112 and y in 380..480)
arr_clean_alpha[380:480, :112] = 0.0

# 2. Clear floor shadow below the bottom bevel of HP ENGENHARIA (y > 864)
for y in range(864, arr_clean_alpha.shape[0]):
    factor = max(0.0, 1.0 - (y - 864) / 4.0)
    arr_clean_alpha[y, :] *= factor

# 3. Clean low alpha noise (< 0.12)
arr_clean_alpha[arr_clean_alpha < 0.12] = 0.0

# 4. Smoothstep alpha curve to get crisp solid body and antialiased 1-2px boundary
def smoothstep(edge0, edge1, x):
    t = np.clip((x - edge0) / (edge1 - edge0), 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)

crisp_alpha = smoothstep(0.18, 0.85, arr_clean_alpha)

# 5. Rigorous White De-matting (Defringing)
# The original render was on pure white (255, 255, 255).
# For boundary pixels where 0 < alpha < 1, the observed color is:
# C_obs = alpha * C_foreground + (1 - alpha) * 255
# Therefore C_foreground = (C_obs - (1 - alpha) * 255) / alpha
alpha_expanded = np.maximum(crisp_alpha[:, :, None], 0.06)
unmatted_rgb = (rgb - (1.0 - crisp_alpha[:, :, None]) * 255.0) / alpha_expanded
unmatted_rgb = np.clip(unmatted_rgb, 0.0, 255.0)

# Where alpha is solid (>= 0.98), keep the pristine original render colors
solid_mask = (crisp_alpha >= 0.98)[:, :, None]
final_rgb = np.where(solid_mask, rgb, unmatted_rgb)

# Assemble final RGBA
result_arr = np.zeros_like(arr, dtype=np.uint8)
result_arr[:, :, :3] = np.round(final_rgb).astype(np.uint8)
result_arr[:, :, 3] = np.round(crisp_alpha * 255.0).astype(np.uint8)

# Crop tight to bounding box
non_empty = result_arr[:, :, 3] > 0
rows = np.any(non_empty, axis=1)
cols = np.any(non_empty, axis=0)
rmin, rmax = np.where(rows)[0][[0, -1]]
cmin, cmax = np.where(cols)[0][[0, -1]]

final_cropped = result_arr[rmin:rmax+1, cmin:cmax+1]
final_img = Image.fromarray(final_cropped)

# Save clean logo
final_img.save('assets/hp-logo-oficial.png')
print('Clean logo saved to assets/hp-logo-oficial.png! Size:', final_img.size)

# Generate preview on footer dark green #073D2E
footer_canvas = Image.new('RGBA', (final_img.width + 120, final_img.height + 120), (7, 61, 46, 255))
footer_canvas.alpha_composite(final_img, (60, 60))
footer_canvas.save('C:/Users/manod/.gemini/antigravity/brain/4d9b160e-f25c-409d-ad3f-a61821d605c7/preview_footer_clean.png')

# Generate preview on white #FFFFFF
white_canvas = Image.new('RGBA', (final_img.width + 120, final_img.height + 120), (255, 255, 255, 255))
white_canvas.alpha_composite(final_img, (60, 60))
white_canvas.save('C:/Users/manod/.gemini/antigravity/brain/4d9b160e-f25c-409d-ad3f-a61821d605c7/preview_white_clean.png')

print('All previews generated!')
