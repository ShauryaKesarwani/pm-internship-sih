import torch

print(torch.cuda.is_available())  # True if CUDA wheel + NVIDIA GPU + drivers

# By default, tensors go to CPU:
x = torch.tensor([1, 2, 3])
print(x.device)  # cpu

# Explicitly put them on GPU:
if torch.cuda.is_available():
    x = x.to("cuda")
    print(x.device)  # cuda:0
