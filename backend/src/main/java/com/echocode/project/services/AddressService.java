package com.echocode.project.services;

import com.echocode.project.dto.AddressRequest;
import com.echocode.project.dto.AddressResponse;
import com.echocode.project.entities.Address;
import com.echocode.project.entities.User;
import com.echocode.project.repositories.AddressRepository;
import com.echocode.project.repositories.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AddressService {

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Transactional(readOnly = true)
    public List<AddressResponse> getAllAddressesByUser(long userId) {
        return addressRepository.findByUser_UserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AddressResponse getAddressById(long userId, long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (address.getUser().getUserId() != userId) {
            throw new RuntimeException("Address does not belong to user");
        }

        return mapToResponse(address);
    }

    @Transactional
    public AddressResponse createAddress(long userId, AddressRequest request) {
        User user = clientRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Verificar si es la primera dirección del usuario
        List<Address> existingAddresses = addressRepository.findByUser_UserId(userId);
        boolean isFirstAddress = existingAddresses.isEmpty();

        // Si es la primera dirección, debe ser predeterminada
        boolean shouldBeDefault = isFirstAddress || (request.getIsDefault() != null && request.getIsDefault());

        // Si debe ser default, quitar default de las demás
        if (shouldBeDefault && !isFirstAddress) {
            removeDefaultFromOtherAddresses(userId);
        }

        Address address = Address.builder()
                .user(user)
                .alias(request.getAlias())
                .street(request.getStreet())
                .number(request.getNumber())
                .apartmentNumber(request.getApartmentNumber())
                .city(request.getCity())
                .zipCode(request.getZipCode())
                .additionalInfo(request.getAdditionalInfo())
                .isDefault(shouldBeDefault)
                .build();

        address = addressRepository.save(address);
        return mapToResponse(address);
    }

    @Transactional
    public AddressResponse updateAddress(long userId, long addressId, AddressRequest request) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (address.getUser().getUserId() != userId) {
            throw new RuntimeException("Address does not belong to user");
        }

        // Si se marca como default, quitar default de las demás
        if (request.getIsDefault() != null && request.getIsDefault() && !address.isDefault()) {
            removeDefaultFromOtherAddresses(userId);
        }

        address.setAlias(request.getAlias());
        address.setStreet(request.getStreet());
        address.setNumber(request.getNumber());
        address.setApartmentNumber(request.getApartmentNumber());
        address.setCity(request.getCity());
        address.setZipCode(request.getZipCode());
        address.setAdditionalInfo(request.getAdditionalInfo());
        address.setDefault(request.getIsDefault() != null && request.getIsDefault());

        address = addressRepository.save(address);
        return mapToResponse(address);
    }

    @Transactional
    public void deleteAddress(long userId, long addressId) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Address not found"));

        if (address.getUser().getUserId() != userId) {
            throw new RuntimeException("Address does not belong to user");
        }

        addressRepository.delete(address);
    }

    private void removeDefaultFromOtherAddresses(long userId) {
        List<Address> addresses = addressRepository.findByUser_UserId(userId);
        addresses.forEach(addr -> {
            if (addr.isDefault()) {
                addr.setDefault(false);
                addressRepository.save(addr);
            }
        });
    }

    private AddressResponse mapToResponse(Address address) {
        return AddressResponse.builder()
                .id(address.getId())
                .alias(address.getAlias())
                .street(address.getStreet())
                .number(address.getNumber())
                .apartmentNumber(address.getApartmentNumber())
                .city(address.getCity())
                .zipCode(address.getZipCode())
                .additionalInfo(address.getAdditionalInfo())
                .isDefault(address.isDefault())
                .build();
    }
}
